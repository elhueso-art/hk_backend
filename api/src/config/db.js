const mongoose = require('mongoose'); // Carga Mongoose para conectar con MongoDB.

const connectDB = async () => { // Define la conexión con la base de datos.
    if (!process.env.MONGO_URI) { // Comprueba que exista la dirección de MongoDB.
        throw new Error('Falta configurar MONGO_URI al fitxer .env'); // Detiene el arranque si falta la configuración.
    } // Termina la comprobación de configuración.

    await mongoose.connect(process.env.MONGO_URI); // Abre la conexión con MongoDB.
    console.log('MongoDB connectat correctament'); // Confirma la conexión en la consola.
}; // Termina la función de conexión.

module.exports = connectDB; // Exporta la conexión para el servidor.

