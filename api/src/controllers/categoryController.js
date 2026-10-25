const categoryService = require('../services/categoryService'); // Importa la lógica de categorías.

const allowedFields = ['name', 'slug', 'description', 'active']; // Define los únicos campos aceptados.

const respondWithError = (res, error) => { // Convierte fallos en respuestas HTTP.
    const statusCode = error.statusCode || (error.code === 11000 ? 409 : error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500); // Traduce duplicados y validaciones.
    if (statusCode === 500) console.error(error); // Registra errores internos.
    return res.status(statusCode).json({ status: 'error', message: statusCode === 500 ? 'Error interno del servidor' : error.message }); // Devuelve un mensaje seguro.
}; // Termina la respuesta de error.

const isObjectBody = (body) => body !== null && typeof body === 'object' && !Array.isArray(body); // Acepta solo objetos JSON.

const hasOnlyAllowedFields = (body) => Object.keys(body).every((field) => allowedFields.includes(field)); // Rechaza campos arbitrarios.

const listCategories = async (req, res) => { // Atiende el listado de categorías.
    try { // Captura errores del servicio.
        const active = req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined; // Convierte el filtro active.
        const categories = await categoryService.getCategories({ active }); // Consulta las categorías filtradas.
        return res.json({ status: 'success', data: categories }); // Devuelve el listado.
    } catch (error) { // Captura fallos de consulta.
        return respondWithError(res, error); // Devuelve el error normalizado.
    } // Termina el manejo de errores.
}; // Termina el controlador del listado.

const getCategory = async (req, res) => { // Atiende la consulta individual.
    try { // Captura errores de identificador o base de datos.
        const category = await categoryService.getCategoryById(req.params.id); // Busca la categoría solicitada.
        if (!category) return res.status(404).json({ status: 'error', message: 'Categoría no encontrada' }); // Devuelve 404 si falta.
        return res.json({ status: 'success', data: category }); // Devuelve la categoría encontrada.
    } catch (error) { // Captura fallos de consulta.
        return respondWithError(res, error); // Devuelve el error normalizado.
    } // Termina el manejo de errores.
}; // Termina el controlador individual.

const createCategory = async (req, res) => { // Atiende la creación de categorías.
    try { // Captura validaciones y errores de duplicado.
        if (!isObjectBody(req.body) || !hasOnlyAllowedFields(req.body)) return res.status(400).json({ status: 'error', message: 'Envía un objeto con name, slug, description y active' }); // Valida el cuerpo.
        if (typeof req.body.name !== 'string' || !req.body.name.trim() || typeof req.body.slug !== 'string' || !req.body.slug.trim()) return res.status(400).json({ status: 'error', message: 'name y slug son obligatorios' }); // Evita usar métodos de texto con valores inválidos.
        if (req.body.description !== undefined && typeof req.body.description !== 'string') return res.status(400).json({ status: 'error', message: 'description debe ser texto' }); // Valida el tipo de descripción.
        if (req.body.active !== undefined && typeof req.body.active !== 'boolean') return res.status(400).json({ status: 'error', message: 'active debe ser booleano' }); // Valida el tipo de estado.
        const category = await categoryService.createCategory(req.body); // Valida y crea la categoría.
        return res.status(201).json({ status: 'success', data: category }); // Devuelve la categoría creada.
    } catch (error) { // Captura errores del servicio.
        return respondWithError(res, error); // Devuelve el error normalizado.
    } // Termina el manejo de errores.
}; // Termina el controlador de creación.

const updateCategory = async (req, res) => { // Atiende la modificación completa de categoría.
    try { // Captura validaciones y errores de duplicado.
        if (!isObjectBody(req.body) || !hasOnlyAllowedFields(req.body) || !req.body.name || !req.body.slug) return res.status(400).json({ status: 'error', message: 'PUT requiere name y slug y solo acepta campos de categoría' }); // Valida el cuerpo y los campos obligatorios.
        if (typeof req.body.name !== 'string' || !req.body.name.trim() || typeof req.body.slug !== 'string' || !req.body.slug.trim()) return res.status(400).json({ status: 'error', message: 'name y slug deben ser texto no vacío' }); // Valida los tipos antes de normalizar el slug.
        if (req.body.description !== undefined && typeof req.body.description !== 'string') return res.status(400).json({ status: 'error', message: 'description debe ser texto' }); // Valida el tipo de descripción.
        if (req.body.active !== undefined && typeof req.body.active !== 'boolean') return res.status(400).json({ status: 'error', message: 'active debe ser booleano' }); // Valida el tipo de estado.
        const category = await categoryService.updateCategory(req.params.id, req.body); // Actualiza la categoría.
        if (!category) return res.status(404).json({ status: 'error', message: 'Categoría no encontrada' }); // Devuelve 404 si falta.
        return res.json({ status: 'success', data: category }); // Devuelve la categoría modificada.
    } catch (error) { // Captura fallos de actualización.
        return respondWithError(res, error); // Devuelve el error normalizado.
    } // Termina el manejo de errores.
}; // Termina el controlador de actualización.

const deleteCategory = async (req, res) => { // Atiende la eliminación de categoría.
    try { // Captura relaciones conflictivas y errores de base de datos.
        const category = await categoryService.deleteCategory(req.params.id); // Elimina si no tiene productos asociados.
        if (!category) return res.status(404).json({ status: 'error', message: 'Categoría no encontrada' }); // Devuelve 404 si falta.
        return res.status(204).send(); // Confirma la eliminación.
    } catch (error) { // Captura fallos de eliminación.
        return respondWithError(res, error); // Devuelve el error normalizado.
    } // Termina el manejo de errores.
}; // Termina el controlador de eliminación.

module.exports = { // Expone los controladores a las rutas.
    listCategories, // Exporta el listado.
    getCategory, // Exporta la consulta individual.
    createCategory, // Exporta la creación.
    updateCategory, // Exporta la modificación.
    deleteCategory // Exporta la eliminación.
}; // Termina las exportaciones.
