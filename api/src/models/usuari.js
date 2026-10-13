
const mongoose = require('mongoose');

const usuariSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    rol: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    edat: {
        type: Number,
        min: 18,
        max: 120
    }
});

module.exports = mongoose.model('Usuari', usuariSchema);
