const bcrypt = require('bcrypt'); // Carga bcrypt para cifrar contraseñas.
const User = require('../models/user'); // Importa el modelo seguro de usuario.

const conflictError = (message) => { // Prepara un error de dato duplicado.
    const error = new Error(message); // Crea un error con explicación.
    error.statusCode = 409; // Marca el conflicto con estado HTTP 409.
    return error; // Devuelve el error preparado.
}; // Termina el creador de conflictos.

const getUsers = async () => User.find().sort({ createdAt: -1 }); // Lista usuarios sin seleccionar sus hashes.
const getUserById = async (id) => User.findById(id); // Busca un usuario sin seleccionar su hash.

const createUser = async ({ name, email, password }) => { // Crea un usuario desde campos explícitos.
    const normalizedEmail = email.trim().toLowerCase(); // Normaliza el correo antes de buscar duplicados.
    const existingUser = await User.findOne({ email: normalizedEmail }); // Comprueba si el correo ya está registrado.
    if (existingUser) throw conflictError('El correo ya está registrado'); // Rechaza correos existentes.
    const passwordHash = await bcrypt.hash(password, 12); // Convierte la contraseña en un hash con coste 12.
    return User.create({ name, email: normalizedEmail, passwordHash, role: 'client', active: true }); // Guarda solo el hash y asigna rol cliente.
}; // Termina la creación de usuario.

const updateUser = async (id, fields) => { // Actualiza solo los campos autorizados.
    const user = await User.findById(id).select('+passwordHash'); // Carga el hash solo para poder actualizarlo.
    if (!user) return null; // Informa si el usuario no existe.

    if (fields.name !== undefined) user.name = fields.name; // Actualiza el nombre si se envió.
    if (fields.email !== undefined) { // Comprueba un correo nuevo.
        const normalizedEmail = fields.email.trim().toLowerCase(); // Normaliza el correo.
        const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: id } }); // Busca el correo en otras cuentas.
        if (existingUser) throw conflictError('El correo ya está registrado'); // Rechaza el correo duplicado.
        user.email = normalizedEmail; // Asigna el correo disponible.
    } // Termina la actualización del correo.
    if (fields.password !== undefined) user.passwordHash = await bcrypt.hash(fields.password, 12); // Guarda solo el nuevo hash.
    if (fields.active !== undefined) user.active = fields.active; // Cambia el estado solo si se indicó.

    return user.save(); // Valida y guarda los cambios.
}; // Termina la actualización de usuario.

const deactivateUser = async (id) => { // Desactiva una cuenta sin borrar sus datos.
    const user = await User.findById(id); // Busca la cuenta solicitada.
    if (!user) return null; // Informa si la cuenta no existe.
    user.active = false; // Marca la cuenta como inactiva.
    return user.save(); // Guarda la baja lógica.
}; // Termina la baja lógica.

module.exports = { // Expone las operaciones del servicio.
    getUsers, // Exporta el listado.
    getUserById, // Exporta la consulta individual.
    createUser, // Exporta la creación con hash.
    updateUser, // Exporta la modificación permitida.
    deactivateUser // Exporta la baja lógica.
}; // Termina las exportaciones.
