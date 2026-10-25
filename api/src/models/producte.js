const mongoose = require('mongoose'); // Carga Mongoose para definir modelos de MongoDB.

const opcioMidaSchema = new mongoose.Schema( // Define cada tamaño vendible del producto.
    { // Declara los datos de una opción de tamaño.
        nom: { type: String, required: true, trim: true, maxlength: 50 }, // Guarda el nombre del tamaño.
        porcions: { type: Number, min: 1, validate: Number.isInteger }, // Indica cuántas porciones ofrece.
        diametreCm: { type: Number, min: 1, max: 100 }, // Guarda el diámetro en centímetros.
        pesGrams: { type: Number, min: 1 }, // Guarda el peso en gramos.
        preu: { type: Number, required: true, min: [0.01, 'El preu ha de ser superior a zero'], validate: Number.isFinite }, // Define el precio válido de este tamaño.
        stock: { type: Number, min: 0, default: 0, validate: Number.isInteger } // Controla las unidades disponibles.
    }, // Cierra los campos del tamaño.
    { _id: false } // Evita crear un identificador extra para cada tamaño.
); // Termina el esquema de tamaños.

const producteSchema = new mongoose.Schema( // Define la ficha principal de cada producto.
    { // Declara los campos de catálogo.
        nom: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 }, // Guarda el nombre del producto.
        descripcio: { type: String, trim: true, maxlength: 1000, default: '' }, // Guarda su descripción.
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Relaciona el producto con una categoría guardada en MongoDB.
        preu: { // Define el precio base del producto.
            type: Number, // Guarda el precio como número.
            required: true, // Exige un precio.
            min: [0.01, 'El preu ha de ser superior a zero'], // Rechaza precios de cero o negativos.
            validate: { // Añade una validación personalizada.
                validator: Number.isFinite, // Acepta solo números finitos.
                message: 'El preu ha de ser un número vàlid' // Explica el error de precio.
            } // Cierra la validación del precio.
        }, // Cierra el campo de precio.
        stock: { // Define el inventario general.
            type: Number, // Guarda unidades disponibles.
            min: 0, // Impide inventario negativo.
            default: 0, // Inicia el inventario en cero.
            validate: { // Añade una validación para el inventario.
                validator: Number.isInteger, // Permite solo unidades enteras.
                message: "L'estoc ha de ser un nombre enter" // Explica el error de inventario.
            } // Cierra la validación del inventario.
        }, // Cierra el campo de inventario.
        sabors: { type: [{ type: String, trim: true }], default: [] }, // Enumera los sabores disponibles.
        farcits: { type: [{ type: String, trim: true }], default: [] }, // Enumera los rellenos disponibles.
        cobertures: { type: [{ type: String, trim: true }], default: [] }, // Enumera las coberturas del producto.
        ingredients: { type: [{ type: String, trim: true }], default: [] }, // Guarda los ingredientes.
        alergens: { type: [{ type: String, trim: true }], default: [] }, // Informa de los alérgenos.
        etiquetes: { type: [{ type: String, trim: true }], default: [] }, // Guarda etiquetas como vegano o sin gluten.
        porcions: { type: Number, min: 1, validate: Number.isInteger }, // Indica las porciones del formato base.
        mides: { type: [opcioMidaSchema], default: [] }, // Guarda tamaños con precio y stock propios.
        personalitzable: { type: Boolean, default: false }, // Indica si se puede personalizar el producto.
        acceptaMissatge: { type: Boolean, default: false }, // Indica si admite un mensaje personalizado.
        sotaComanda: { type: Boolean, default: false }, // Indica si se prepara cuando se recibe un pedido.
        diesPreparacio: { type: Number, min: 0, default: 0, validate: Number.isInteger }, // Establece los días necesarios para prepararlo.
        imatges: { type: [{ type: String, trim: true }], default: [] }, // Guarda direcciones de imágenes.
        destacat: { type: Boolean, default: false }, // Marca productos para destacar en la tienda.
        actiu: { type: Boolean, default: true } // Controla si el producto aparece en el catálogo.
    }, // Cierra los campos del producto.
    { timestamps: true } // Añade fechas automáticas de creación y actualización.
); // Termina el esquema del producto.

producteSchema.index({ nom: 1 }); // Acelera búsquedas por nombre.
producteSchema.index({ category: 1, actiu: 1 }); // Acelera filtros por categoría y disponibilidad.
producteSchema.index({ destacat: 1, actiu: 1 }); // Acelera la lista de productos destacados.
producteSchema.index({ nom: 'text', descripcio: 'text', sabors: 'text', farcits: 'text' }); // Permite buscar por texto en el catálogo.

module.exports = mongoose.model('Product', producteSchema, 'productes'); // Exporta Product y conserva la colección existente.
