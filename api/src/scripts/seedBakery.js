require('dotenv').config(); // Carga la conexión configurada en .env.

const mongoose = require('mongoose'); // Importa Mongoose para cerrar la conexión al final.
const connectDB = require('../config/db'); // Importa la conexión de la API.
const Category = require('../models/category'); // Importa el modelo de categorías.
const Product = require('../models/producte'); // Importa el modelo de productos.

const demoCategories = [ // Define categorías de ejemplo para la pastelería.
    { name: 'Pasteles', slug: 'pasteles', description: 'Pasteles y tartas para celebraciones' }, // Agrupa pasteles y tartas.
    { name: 'Cupcakes', slug: 'cupcakes', description: 'Cupcakes decorados y por encargo' }, // Agrupa cupcakes.
    { name: 'Galletas', slug: 'galletas', description: 'Galletas artesanales y decoradas' }, // Agrupa galletas.
    { name: 'Bollería', slug: 'bolleria', description: 'Bollería recién horneada' }, // Agrupa bollería.
    { name: 'Postres', slug: 'postres', description: 'Postres individuales y para compartir' } // Agrupa otros postres.
]; // Termina las categorías de ejemplo.

const demoProducts = [ // Define dos productos de ejemplo por categoría.
    { category: 'pasteles', data: { nom: 'Pastel de chocolate', descripcio: 'Bizcocho de cacao con ganache', preu: 30, stock: 0, sabors: ['chocolate'], farcits: ['ganache'], alergens: ['gluten', 'lácteos', 'huevo'], porcions: 8, personalitzable: true, acceptaMissatge: true, sotaComanda: true, diesPreparacio: 2 } }, // Añade el pastel de chocolate.
    { category: 'pasteles', data: { nom: 'Pastel Hello Kitty de vainilla', descripcio: 'Pastel de vainilla con decoración temática', preu: 38, stock: 0, sabors: ['vainilla'], farcits: ['crema'], alergens: ['gluten', 'lácteos', 'huevo'], porcions: 10, personalitzable: true, acceptaMissatge: true, sotaComanda: true, diesPreparacio: 3 } }, // Añade el pastel temático.
    { category: 'cupcakes', data: { nom: 'Cupcakes de fresa', descripcio: 'Bizcocho de vainilla con crema de fresa', preu: 18, stock: 0, sabors: ['fresa', 'vainilla'], alergens: ['gluten', 'lácteos', 'huevo'], sotaComanda: true, diesPreparacio: 1 } }, // Añade cupcakes de fresa.
    { category: 'cupcakes', data: { nom: 'Cupcakes de chocolate', descripcio: 'Cupcakes de cacao con cobertura de chocolate', preu: 20, stock: 0, sabors: ['chocolate'], alergens: ['gluten', 'lácteos', 'huevo'], sotaComanda: true, diesPreparacio: 1 } }, // Añade cupcakes de chocolate.
    { category: 'galletas', data: { nom: 'Galletas decoradas Hello Kitty', descripcio: 'Galletas de mantequilla con glaseado decorado', preu: 16, stock: 0, sabors: ['mantequilla', 'vainilla'], alergens: ['gluten', 'lácteos', 'huevo'], personalitzable: true, sotaComanda: true, diesPreparacio: 2 } }, // Añade galletas temáticas.
    { category: 'galletas', data: { nom: 'Galletas de mantequilla', descripcio: 'Galletas artesanales de mantequilla', preu: 12, stock: 8, sabors: ['mantequilla'], alergens: ['gluten', 'lácteos', 'huevo'] } }, // Añade galletas clásicas.
    { category: 'bolleria', data: { nom: 'Croissants de mantequilla', descripcio: 'Croissants hojaldrados de mantequilla', preu: 3, stock: 12, sabors: ['mantequilla'], alergens: ['gluten', 'lácteos', 'huevo'] } }, // Añade croissants.
    { category: 'bolleria', data: { nom: 'Napolitana de chocolate', descripcio: 'Hojaldre relleno de chocolate', preu: 3.5, stock: 10, sabors: ['chocolate'], alergens: ['gluten', 'lácteos', 'huevo'] } }, // Añade napolitanas.
    { category: 'postres', data: { nom: 'Tarta de queso', descripcio: 'Tarta cremosa de queso horneada', preu: 26, stock: 0, sabors: ['queso'], alergens: ['gluten', 'lácteos', 'huevo'], porcions: 8, sotaComanda: true, diesPreparacio: 1 } }, // Añade tarta de queso.
    { category: 'postres', data: { nom: 'Brownie clásico', descripcio: 'Brownie de chocolate y nueces', preu: 4, stock: 8, sabors: ['chocolate', 'nueces'], alergens: ['gluten', 'lácteos', 'huevo', 'frutos secos'] } } // Añade brownies.
]; // Termina los productos de ejemplo.

const legacyCategorySlugs = { pasteles: 'pastissos' }; // Traduce la categoría antigua de pasteles al nuevo slug.

const ensureLocalDatabase = () => { // Comprueba que los datos ficticios solo vayan a MongoDB local.
    if (!process.env.MONGO_URI) throw new Error('Configura MONGO_URI en .env antes de ejecutar la carga local'); // Exige una conexión definida.
    const hostname = new URL(process.env.MONGO_URI).hostname.replace('[', '').replace(']', '').toLowerCase(); // Extrae el host sin mostrar credenciales.
    if (!['localhost', '127.0.0.1', '::1'].includes(hostname)) throw new Error('La carga de datos de ejemplo solo permite MongoDB local'); // Impide modificar una base remota.
}; // Termina la comprobación de entorno local.

const runSeed = async () => { // Crea ejemplos y comprueba las relaciones.
    ensureLocalDatabase(); // Bloquea la ejecución si MongoDB no es local.
    await connectDB(); // Conecta con la base local.
    try { // Garantiza el cierre de la conexión incluso si falla una operación.
        const categoriesBySlug = new Map(); // Guarda las categorías creadas o ya existentes.
        for (const categoryData of demoCategories) { // Recorre las categorías de pastelería.
            const category = await Category.findOneAndUpdate({ slug: categoryData.slug }, { $setOnInsert: categoryData }, { upsert: true, new: true, setDefaultsOnInsert: true }); // Crea la categoría solo si todavía no existe.
            categoriesBySlug.set(category.slug, category); // Guarda la categoría para asignarla a productos.
            const previousSlugs = [category.slug, legacyCategorySlugs[category.slug]].filter(Boolean); // Prepara los slugs nuevos y antiguos.
            await Product.collection.updateMany({ category: { $exists: false }, categoria: { $in: previousSlugs } }, { $set: { category: category._id }, $unset: { categoria: '' } }); // Migra el campo antiguo directamente sin que el esquema lo descarte.
        } // Termina la carga de categorías.
        for (const product of demoProducts) { // Recorre los productos de ejemplo.
            const category = categoriesBySlug.get(product.category); // Busca la categoría correspondiente.
            const productData = { ...product.data, category: category._id }; // Añade la referencia ObjectId de la categoría.
            await Product.findOneAndUpdate({ nom: productData.nom, category: category._id }, { $setOnInsert: productData }, { upsert: true, new: true, setDefaultsOnInsert: true }); // Inserta el producto solo si aún no existe.
        } // Termina la carga de productos.
        for (const category of categoriesBySlug.values()) { // Recorre cada categoría para comprobar la relación.
            const products = await Product.find({ category: category._id }).populate('category', 'name slug'); // Consulta productos y resuelve category con populate.
            if (products.length < 2) throw new Error('La categoría ' + category.slug + ' no tiene dos productos'); // Comprueba el mínimo solicitado.
            console.log(category.name + ' [' + category.slug + ']: ' + products.map((product) => product.nom + ' → ' + product.category.slug).join(', ')); // Muestra los productos y su categoría poblada.
        } // Termina la comprobación de relaciones.
    } finally { // Cierra MongoDB al terminar la carga.
        await mongoose.disconnect(); // Libera la conexión local.
    } // Termina el cierre garantizado.
}; // Termina la carga de ejemplo.

runSeed().catch((error) => { // Captura errores de conexión, validación o carga.
    console.error('No se pudieron cargar los datos de ejemplo: ' + error.message); // Muestra un diagnóstico breve.
    process.exitCode = 1; // Indica que la carga terminó con error.
}); // Termina el manejo de errores.
