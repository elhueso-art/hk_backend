const mongoose = require('mongoose'); // Carga Mongoose para definir el modelo de usuario.

const usuariSchema = new mongoose.Schema({ // Define los datos guardados para cada usuario.
    nom: { // Declara el nombre del usuario.
        type: String, // Guarda el nombre como texto.
        required: true, // Exige que el nombre esté informado.
        minlength: 2, // Rechaza nombres demasiado cortos.
        maxlength: 50 // Limita la longitud del nombre.
    }, // Cierra el campo del nombre.
    email: { // Declara el correo del usuario.
        type: String, // Guarda el correo como texto.
        required: true, // Exige un correo.
        unique: true, // Evita correos duplicados.
        lowercase: true, // Guarda el correo en minúsculas.
        trim: true, // Elimina espacios al principio y al final.
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Comprueba que el correo tenga un formato básico válido.
    }, // Cierra el campo del correo.
    rol: { // Declara el nivel de acceso.
        type: String, // Guarda el rol como texto.
        enum: ['client', 'admin'], // Solo permite cliente o administrador.
        default: 'client' // Asigna rol de cliente por defecto.
    }, // Cierra el campo del rol.
    edat: { // Declara la edad del usuario.
        type: Number, // Guarda la edad como número.
        min: 18, // Requiere al menos 18 años.
        max: 120 // Limita la edad a un valor razonable.
    } // Cierra el campo de edad.
}); // Termina el esquema del usuario.

module.exports = mongoose.model('Usuari', usuariSchema); // Exporta el modelo de usuario.
