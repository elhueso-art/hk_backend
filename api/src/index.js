require('dotenv').config(); // Carga las variables del archivo .env.

const express = require('express'); // Carga Express para crear la API.
const connectDB = require('./config/db'); // Importa la conexión con MongoDB.
const productRoutes = require('./routes/productRoutes'); // Importa las rutas del catálogo.
const categoryRoutes = require('./routes/categoryRoutes'); // Importa las rutas de categorías.
const userRoutes = require('./routes/userRoutes'); // Importa las rutas locales de usuarios.
const localOnly = require('./middleware/localOnly'); // Importa la restricción de acceso local.

const app = express(); // Crea la aplicación HTTP.
app.disable('x-powered-by'); // Oculta el encabezado que identifica Express.
app.use(express.json({ limit: '1mb' })); // Permite recibir JSON y limita el tamaño del cuerpo.

app.get('/', (req, res) => // Define la ruta principal.
    res.json({ status: 'success', message: 'API de pastisseria en marxa' }) // Devuelve el estado de la API.
); // Termina la ruta principal.
app.get('/health', (req, res) => // Define una ruta sencilla de estado.
    res.json({ status: 'success', database: 'connected' }) // Confirma que el servidor y la base están activos.
); // Termina la ruta de estado.
app.use('/api/products', productRoutes); // Conecta las rutas del catálogo bajo /api/products.
app.use('/api/categories', categoryRoutes); // Conecta el CRUD de categorías.
app.use('/api/users', localOnly, userRoutes); // Restringe el CRUD de usuarios a desarrollo local.

app.use((req, res) => // Captura cualquier ruta que no esté definida.
    res.status(404).json({ status: 'error', message: 'Ruta no trobada' }) // Devuelve un error de ruta inexistente.
); // Termina el manejador de rutas desconocidas.

const startServer = async () => { // Prepara el arranque completo del servidor.
    await connectDB(); // Espera a que MongoDB esté conectado.
    const port = Number(process.env.PORT) || 3000; // Lee el puerto configurado o usa 3000.
    app.listen(port, () => console.log('API escoltant al port ' + port)); // Empieza a aceptar peticiones HTTP.
}; // Termina la función de arranque.

if (require.main === module) { // Comprueba que este archivo se esté ejecutando directamente.
    startServer().catch((error) => { // Captura errores producidos durante el arranque.
        console.error("No s'ha pogut iniciar el servidor: " + error.message); // Muestra la causa del fallo.
        process.exitCode = 1; // Indica al sistema que el proceso terminó con error.
    }); // Termina el manejo de errores de arranque.
} // Termina la comprobación de ejecución directa.

module.exports = app; // Exporta la aplicación para reutilizarla en otras partes.

