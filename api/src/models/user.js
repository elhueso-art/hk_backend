const mongoose = require('mongoose'); // Carga Mongoose para definir el modelo de usuario.

const userSchema = new mongoose.Schema( // Define los datos persistidos de cada usuario.
    {
        name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 }, // Guarda el nombre validado.
        email: { // Declara el correo único del usuario.
            type: String, // Guarda el correo como texto.
            required: true, // Exige un correo.
            unique: true, // Crea un índice único para evitar duplicados.
            lowercase: true, // Normaliza el correo en minúsculas.
            trim: true, // Elimina espacios sobrantes.
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Comprueba el formato básico del correo.
        }, // Cierra el campo del correo.
        passwordHash: { type: String, required: true, select: false }, // Guarda solo el hash y lo excluye de consultas normales.
        role: { type: String, enum: ['client', 'admin'], default: 'client' }, // Asigna un rol permitido y usa cliente por defecto.
        active: { type: Boolean, default: true } // Permite desactivar la cuenta sin borrarla.
    }, // Cierra los campos de usuario.
    { // Configura opciones adicionales del modelo.
        timestamps: true, // Añade las fechas de creación y actualización.
        toJSON: { // Define cómo se serializa el usuario en respuestas JSON.
            transform: (document, result) => { // Prepara una copia pública del usuario.
                delete result.passwordHash; // Impide devolver el hash de contraseña.
                delete result.__v; // Oculta el contador interno de versión.
                return result; // Devuelve los datos visibles.
            } // Termina la transformación JSON.
        } // Cierra las opciones JSON.
    } // Cierra las opciones del esquema.
); // Termina el esquema de usuario.

module.exports = mongoose.model('User', userSchema); // Exporta el modelo User.

