const Product = require('../models/producte'); // Importa el modelo de producto de pastelería.

const getProducts = async (filters = {}) => { // Busca productos aplicando filtros opcionales.
    const query = {}; // Prepara el filtro que recibirá MongoDB.

    if (filters.category) query.category = filters.category; // Filtra por categoría cuando se indica.
    if (filters.actiu !== undefined) query.actiu = filters.actiu; // Filtra productos activos o inactivos.
    if (filters.destacat !== undefined) query.destacat = filters.destacat; // Filtra productos destacados.

    const preu = {}; // Prepara los límites de precio.
    if (Number.isFinite(filters.preuMin)) preu.$gte = filters.preuMin; // Aplica el precio mínimo.
    if (Number.isFinite(filters.preuMax)) preu.$lte = filters.preuMax; // Aplica el precio máximo.
    if (Object.keys(preu).length) query.preu = preu; // Añade el rango de precio si existe.
    if (filters.q) query.$text = { $search: filters.q }; // Busca texto en los campos indexados.

    const page = Math.max(1, filters.page || 1); // Garantiza que la página sea al menos la primera.
    const limit = Math.min(100, Math.max(1, filters.limit || 20)); // Limita cada página a un máximo de cien productos.
    const [products, total] = await Promise.all([ // Consulta productos y total al mismo tiempo.
        Product.find(query).populate('category') // Busca productos y carga sus categorías relacionadas.
            .sort({ destacat: -1, createdAt: -1 }) // Ordena primero los destacados y luego los recientes.
            .skip((page - 1) * limit) // Salta los productos de páginas anteriores.
            .limit(limit), // Limita la cantidad devuelta.
        Product.countDocuments(query) // Cuenta todos los resultados del filtro.
    ]); // Termina las dos consultas paralelas.

    return { products, total, page, limit }; // Devuelve productos y datos de paginación.
}; // Termina la búsqueda de productos.

const getProductById = async (id) => Product.findById(id).populate('category'); // Busca un producto y carga su categoría.
const createProduct = async (productData) => Product.create(productData).then((product) => product.populate('category')); // Guarda el producto y carga su categoría.

const updateProduct = async (id, productData) => // Define la actualización parcial de un producto.
    Product.findByIdAndUpdate(id, productData, { // Busca el producto y aplica los cambios.
        new: true, // Devuelve el documento actualizado.
        runValidators: true // Valida los campos modificados.
    }).populate('category'); // Devuelve el producto con su categoría relacionada.

const deleteProduct = async (id) => Product.findByIdAndDelete(id); // Elimina el producto indicado.

module.exports = { // Expone las operaciones del servicio.
    getProducts, // Exporta la búsqueda y el filtrado.
    getProductById, // Exporta la consulta por identificador.
    createProduct, // Exporta la creación de productos.
    updateProduct, // Exporta la actualización de productos.
    deleteProduct // Exporta la eliminación de productos.
}; // Termina las exportaciones.
