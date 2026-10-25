const mongoose = require('mongoose'); // Carga Mongoose para definir el modelo de categoría.

const categorySchema = new mongoose.Schema( // Define la información de cada categoría.
    {
        name: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 }, // Guarda el nombre visible de la categoría.
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, // Guarda el identificador URL único.
        description: { type: String, trim: true, maxlength: 500, default: '' }, // Guarda una descripción opcional.
        active: { type: Boolean, default: true } // Permite ocultar la categoría sin borrarla.
    }, // Cierra los campos de categoría.
    { timestamps: true } // Añade fechas de creación y actualización.
); // Termina el esquema de categoría.

module.exports = mongoose.model('Category', categorySchema); // Exporta el modelo Category.

