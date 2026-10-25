const Category = require('../models/category'); // Importa el modelo de categorías.
const Product = require('../models/producte'); // Importa productos para proteger sus relaciones.

const createConflictError = (message) => { // Construye un error HTTP de conflicto.
    const error = new Error(message); // Crea el error con un mensaje claro.
    error.statusCode = 409; // Marca el conflicto como HTTP 409.
    return error; // Devuelve el error preparado.
}; // Termina el creador de errores de conflicto.

const getCategories = async (filters = {}) => { // Lista categorías con filtros opcionales.
    const query = {}; // Prepara los criterios de búsqueda.
    if (filters.active !== undefined) query.active = filters.active; // Filtra por estado cuando se indica.
    return Category.find(query).sort({ name: 1 }); // Devuelve las categorías ordenadas por nombre.
}; // Termina el listado de categorías.

const getCategoryById = async (id) => Category.findById(id); // Busca una categoría por identificador.

const createCategory = async (categoryData) => { // Comprueba el slug y guarda una categoría.
    const slug = categoryData.slug.trim().toLowerCase(); // Normaliza el slug antes de comprobarlo.
    const existingCategory = await Category.findOne({ slug }); // Busca si ya existe ese slug.
    if (existingCategory) throw createConflictError('El slug ya está en uso'); // Rechaza duplicados antes del índice único.
    return Category.create({ ...categoryData, slug }); // Crea la categoría con el slug normalizado.
}; // Termina la creación de categoría.

const updateCategory = async (id, categoryData) => { // Actualiza los campos permitidos de una categoría.
    const category = await Category.findById(id); // Busca la categoría que se quiere modificar.
    if (!category) return null; // Informa si no existe.

    const slug = categoryData.slug.trim().toLowerCase(); // Normaliza el nuevo slug.
    const existingCategory = await Category.findOne({ slug, _id: { $ne: id } }); // Busca el slug en otras categorías.
    if (existingCategory) throw createConflictError('El slug ya está en uso'); // Rechaza el slug duplicado.

    category.name = categoryData.name; // Actualiza el nombre visible.
    category.slug = slug; // Guarda el slug normalizado.
    category.description = categoryData.description ?? ''; // Actualiza o vacía la descripción.
    category.active = categoryData.active ?? true; // Actualiza el estado o lo deja activo por defecto.
    return category.save(); // Valida y guarda la categoría.
}; // Termina la actualización de categoría.

const deleteCategory = async (id) => { // Elimina solo categorías que no tengan productos asociados.
    const category = await Category.findById(id); // Comprueba que la categoría exista.
    if (!category) return null; // Devuelve null si no se encuentra.
    const linkedProduct = await Product.exists({ category: id }); // Comprueba si algún producto la referencia.
    if (linkedProduct) throw createConflictError('No se puede eliminar una categoría con productos asociados'); // Protege las referencias.
    return Category.findByIdAndDelete(id); // Elimina la categoría sin productos.
}; // Termina la eliminación de categoría.

module.exports = { // Expone las operaciones de categoría.
    getCategories, // Exporta el listado.
    getCategoryById, // Exporta la consulta por identificador.
    createCategory, // Exporta la creación.
    updateCategory, // Exporta la actualización.
    deleteCategory // Exporta la eliminación.
}; // Termina las exportaciones.
