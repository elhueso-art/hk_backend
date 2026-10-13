
const mongoose = require('mongoose');

const producteSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    descripcio: {
        type: String,
        maxlength: 500
    },
    preu: {
        type: Number,
        required: true,
        min: [0.01, 'El preu ha de ser superior a zero'],
        validate: {
            validator: Number.isFinite,
            message: 'El preu ha de ser un número vàlid'
        }
    },
    categoria: {
        type: String,
        required: true,
        enum: ['roba', 'tecnologia', 'llar', 'altres']
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'L’estoc ha de ser un nombre enter'
        }
    }
});

producteSchema.index({ nom: 1 });
producteSchema.index({ categoria: 1 });

module.exports = mongoose.model('Producte', producteSchema);
