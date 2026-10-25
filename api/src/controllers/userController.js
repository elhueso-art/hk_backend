const userService = require('../services/userService'); // Importa las operaciones de usuario.

const createFields = ['name', 'email', 'password']; // Permite esos datos al crear cuentas.
const updateFields = ['name', 'email', 'password', 'active']; // Permite modificar solo esos datos.

const respondWithError = (res, error) => { // Convierte errores en respuestas HTTP.
    const statusCode = error.statusCode || (error.code === 11000 ? 409 : error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500); // Traduce conflictos y validaciones.
    if (statusCode === 500) console.error(error); // Registra errores internos.
    return res.status(statusCode).json({ status: 'error', message: statusCode === 500 ? 'Error interno del servidor' : error.message }); // Devuelve un mensaje seguro.
}; // Termina la respuesta de error.

const isObjectBody = (body) => body !== null && typeof body === 'object' && !Array.isArray(body); // Acepta solo objetos JSON.
const hasOnlyFields = (body, fields) => Object.keys(body).every((field) => fields.includes(field)); // Rechaza role, passwordHash y otros campos.

const listUsers = async (req, res) => { // Atiende el listado local de usuarios.
    try { // Captura errores de consulta.
        const users = await userService.getUsers(); // Obtiene usuarios sin hashes.
        return res.json({ status: 'success', data: users }); // Devuelve el listado seguro.
    } catch (error) { // Captura fallos del servicio.
        return respondWithError(res, error); // Devuelve el error normalizado.
    } // Termina el manejo de errores.
}; // Termina el controlador del listado.

const getUser = async (req, res) => { // Atiende la consulta local de un usuario.
    try { // Captura errores de identificador o base de datos.
        const user = await userService.getUserById(req.params.id); // Busca el usuario sin su hash.
        if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' }); // Devuelve 404 si falta.
        return res.json({ status: 'success', data: user }); // Devuelve datos que no incluyen contraseña.
    } catch (error) { // Captura fallos de consulta.
        return respondWithError(res, error); // Devuelve el error normalizado.
    } // Termina el manejo de errores.
}; // Termina el controlador individual.

const createUser = async (req, res) => { // Atiende el registro local ficticio.
    try { // Captura validaciones y conflictos.
        if (!isObjectBody(req.body) || !hasOnlyFields(req.body, createFields)) return res.status(400).json({ status: 'error', message: 'Solo se aceptan name, email y password' }); // Rechaza role y passwordHash enviados por el cliente.
        if (typeof req.body.name !== 'string' || !req.body.name.trim()) return res.status(400).json({ status: 'error', message: 'name es obligatorio' }); // Exige un nombre de texto.
        if (typeof req.body.email !== 'string' || !req.body.email.trim()) return res.status(400).json({ status: 'error', message: 'email es obligatorio' }); // Exige un correo de texto.
        if (typeof req.body.password !== 'string' || req.body.password.length < 12) return res.status(400).json({ status: 'error', message: 'password debe tener al menos 12 caracteres' }); // Exige una contraseña larga.
        const user = await userService.createUser({ name: req.body.name, email: req.body.email, password: req.body.password }); // Crea con rol cliente y contraseña hasheada.
        return res.status(201).json({ status: 'success', data: user }); // Devuelve el usuario sin su hash.
    } catch (error) { // Captura errores del servicio o del índice único.
        return respondWithError(res, error); // Devuelve el error normalizado.
    } // Termina el manejo de errores.
}; // Termina el controlador de creación.

const updateUser = async (req, res) => { // Atiende cambios locales en una cuenta.
    try { // Captura validaciones y conflictos.
        if (!isObjectBody(req.body) || !hasOnlyFields(req.body, updateFields)) return res.status(400).json({ status: 'error', message: 'Solo se aceptan name, email, password y active' }); // Rechaza role y passwordHash arbitrarios.
        if (Object.keys(req.body).length === 0) return res.status(400).json({ status: 'error', message: 'Envía al menos un campo modificable' }); // Evita actualizaciones vacías.
        if (req.body.name !== undefined && (typeof req.body.name !== 'string' || !req.body.name.trim())) return res.status(400).json({ status: 'error', message: 'name debe ser texto no vacío' }); // Valida el nombre enviado.
        if (req.body.email !== undefined && (typeof req.body.email !== 'string' || !req.body.email.trim())) return res.status(400).json({ status: 'error', message: 'email debe ser texto no vacío' }); // Valida el correo enviado.
        if (req.body.password !== undefined && (typeof req.body.password !== 'string' || req.body.password.length < 12)) return res.status(400).json({ status: 'error', message: 'password debe tener al menos 12 caracteres' }); // Valida y limita la contraseña.
        if (req.body.active !== undefined && typeof req.body.active !== 'boolean') return res.status(400).json({ status: 'error', message: 'active debe ser booleano' }); // Acepta solo estados true o false.
        const fields = { name: req.body.name, email: req.body.email, password: req.body.password, active: req.body.active }; // Construye explícitamente los campos permitidos.
        const user = await userService.updateUser(req.params.id, fields); // Aplica los cambios autorizados.
        if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' }); // Devuelve 404 si falta.
        return res.json({ status: 'success', data: user }); // Devuelve el usuario sin el hash.
    } catch (error) { // Captura errores del servicio o del índice único.
        return respondWithError(res, error); // Devuelve el error normalizado.
    } // Termina el manejo de errores.
}; // Termina el controlador de actualización.

const deleteUser = async (req, res) => { // Atiende la baja lógica de una cuenta.
    try { // Captura errores de consulta o guardado.
        const user = await userService.deactivateUser(req.params.id); // Marca la cuenta como inactive.
        if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' }); // Devuelve 404 si falta.
        return res.json({ status: 'success', data: user }); // Devuelve la cuenta ya desactivada.
    } catch (error) { // Captura fallos del servicio.
        return respondWithError(res, error); // Devuelve el error normalizado.
    } // Termina el manejo de errores.
}; // Termina el controlador de baja.

module.exports = { // Expone los controladores a las rutas.
    listUsers, // Exporta el listado.
    getUser, // Exporta la consulta individual.
    createUser, // Exporta la creación.
    updateUser, // Exporta la modificación.
    deleteUser // Exporta la baja lógica.
}; // Termina las exportaciones.
