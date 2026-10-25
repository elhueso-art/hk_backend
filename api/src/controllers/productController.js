const productService = require('../services/productService'); // Importa las operaciones de producto.

const respondWithError = (res, error) => { // Convierte errores internos en respuestas HTTP.
    const statusCode = // Prepara el código HTTP según el tipo de error.
        error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500; // Distingue datos inválidos de errores internos.

    if (statusCode === 500) console.error(error); // Registra los errores inesperados en el servidor.

    return res.status(statusCode).json({ // Envía el error con el estado calculado.
        status: 'error', // Indica que la petición falló.
        message: statusCode === 500 ? 'Error intern del servidor' : error.message // Evita exponer detalles internos.
    }); // Termina la respuesta de error.
}; // Termina el manejador de errores.

const parseBoolean = (value) => { // Convierte parámetros de texto a booleanos.
    if (value === 'true') return true; // Convierte el texto true.
    if (value === 'false') return false; // Convierte el texto false.
    return undefined; // Ignora valores que no son booleanos reconocidos.
}; // Termina la conversión booleana.

const parseNumber = (value) => { // Convierte un parámetro a número válido.
    if (value === undefined || value === '') return undefined; // Ignora valores vacíos.
    const number = Number(value); // Convierte el texto recibido.
    return Number.isFinite(number) ? number : undefined; // Devuelve solo números finitos.
}; // Termina la conversión numérica.

const parsePositiveInteger = (value) => { // Convierte un parámetro a entero positivo.
    const number = parseNumber(value); // Reutiliza la conversión numérica.
    return Number.isInteger(number) && number > 0 ? number : undefined; // Rechaza decimales y valores no positivos.
}; // Termina la conversión a entero.

const isObjectBody = (body) => // Comprueba que el cuerpo de la petición sea un objeto.
    body !== null && typeof body === 'object' && !Array.isArray(body); // Rechaza nulos, listas y tipos simples.

const listProducts = async (req, res) => { // Atiende la consulta del catálogo.
    try { // Captura errores de consulta.
        const result = await productService.getProducts({ // Pide los productos con los filtros recibidos.
            categoria: typeof req.query.categoria === 'string' ? req.query.categoria : undefined, // Lee la categoría si es texto.
            q: typeof req.query.q === 'string' ? req.query.q.trim() : undefined, // Limpia el texto de búsqueda.
            actiu: parseBoolean(req.query.actiu) ?? true, // Muestra productos activos salvo que se indique otra cosa.
            destacat: parseBoolean(req.query.destacat), // Aplica el filtro de destacados.
            preuMin: parseNumber(req.query.preuMin), // Lee el precio mínimo.
            preuMax: parseNumber(req.query.preuMax), // Lee el precio máximo.
            page: parsePositiveInteger(req.query.page), // Lee el número de página.
            limit: parsePositiveInteger(req.query.limit) // Lee el tamaño de página.
        }); // Termina los filtros para el servicio.

        return res.json({ // Devuelve productos y metadatos.
            status: 'success', // Indica que la consulta terminó correctamente.
            data: result.products, // Incluye los productos encontrados.
            meta: { // Agrupa los datos de paginación.
                total: result.total, // Informa cuántos productos coinciden.
                page: result.page, // Informa la página actual.
                limit: result.limit, // Informa el máximo de elementos por página.
                pages: Math.ceil(result.total / result.limit) // Calcula cuántas páginas hay.
            } // Cierra los metadatos de paginación.
        }); // Termina la respuesta del catálogo.
    } catch (error) { // Captura errores del servicio o de MongoDB.
        return respondWithError(res, error); // Devuelve el error en formato uniforme.
    } // Termina el manejo de errores.
}; // Termina el controlador de listado.

const getProduct = async (req, res) => { // Atiende la consulta de un producto individual.
    try { // Captura errores de consulta.
        const product = await productService.getProductById(req.params.id); // Busca el producto solicitado.
        if (!product) { // Comprueba si no existe.
            return res.status(404).json({ status: 'error', message: 'Producte no trobat' }); // Devuelve el estado de no encontrado.
        } // Termina la comprobación de existencia.
        return res.json({ status: 'success', data: product }); // Devuelve el producto encontrado.
    } catch (error) { // Captura identificadores inválidos y otros errores.
        return respondWithError(res, error); // Devuelve el error en formato uniforme.
    } // Termina el manejo de errores.
}; // Termina el controlador de consulta individual.

const createProduct = async (req, res) => { // Atiende la creación de productos.
    try { // Captura errores de validación o guardado.
        if (!isObjectBody(req.body)) { // Comprueba que se recibió un objeto JSON.
            return res.status(400).json({ status: 'error', message: 'El cos ha de ser un objecte JSON' }); // Rechaza cuerpos con formato incorrecto.
        } // Termina la comprobación del cuerpo.
        const product = await productService.createProduct(req.body); // Valida y guarda el producto.
        return res.status(201).json({ status: 'success', data: product }); // Devuelve el producto creado.
    } catch (error) { // Captura errores de creación.
        return respondWithError(res, error); // Devuelve el error en formato uniforme.
    } // Termina el manejo de errores.
}; // Termina el controlador de creación.

const updateProduct = async (req, res) => { // Atiende la actualización parcial de productos.
    try { // Captura errores de validación o guardado.
        if (!isObjectBody(req.body)) { // Comprueba que se recibió un objeto JSON.
            return res.status(400).json({ status: 'error', message: 'El cos ha de ser un objecte JSON' }); // Rechaza cuerpos con formato incorrecto.
        } // Termina la comprobación del cuerpo.
        const product = await productService.updateProduct(req.params.id, req.body); // Actualiza el producto solicitado.
        if (!product) { // Comprueba si el identificador no existe.
            return res.status(404).json({ status: 'error', message: 'Producte no trobat' }); // Devuelve el estado de no encontrado.
        } // Termina la comprobación de existencia.
        return res.json({ status: 'success', data: product }); // Devuelve el producto actualizado.
    } catch (error) { // Captura errores de actualización.
        return respondWithError(res, error); // Devuelve el error en formato uniforme.
    } // Termina el manejo de errores.
}; // Termina el controlador de actualización.

const deleteProduct = async (req, res) => { // Atiende la eliminación de productos.
    try { // Captura errores de borrado.
        const product = await productService.deleteProduct(req.params.id); // Elimina el producto solicitado.
        if (!product) { // Comprueba si el identificador no existe.
            return res.status(404).json({ status: 'error', message: 'Producte no trobat' }); // Devuelve el estado de no encontrado.
        } // Termina la comprobación de existencia.
        return res.status(204).send(); // Confirma el borrado sin cuerpo de respuesta.
    } catch (error) { // Captura errores del servicio.
        return respondWithError(res, error); // Devuelve el error en formato uniforme.
    } // Termina el manejo de errores.
}; // Termina el controlador de eliminación.

module.exports = { // Expone los controladores a las rutas.
    listProducts, // Exporta el listado del catálogo.
    getProduct, // Exporta la consulta individual.
    createProduct, // Exporta la creación.
    updateProduct, // Exporta la actualización.
    deleteProduct // Exporta la eliminación.
}; // Termina las exportaciones.
