const express = require('express'); // Carga Express para definir rutas HTTP.
const router = express.Router(); // Crea un enrutador para los productos.
const productController = require('../controllers/productController'); // Importa los controladores de producto.
const localOnly = require('../middleware/localOnly'); // Restringe cambios de catálogo a desarrollo local.

router.get('/', productController.listProducts); // Expone el listado y los filtros del catálogo.
router.get('/:id', productController.getProduct); // Expone la consulta de un producto.
router.post('/', localOnly, productController.createProduct); // Permite crear productos solo en local.
router.put('/:id', localOnly, productController.updateProduct); // Expone la actualización completa solo en local.
router.patch('/:id', localOnly, productController.updateProduct); // Conserva la actualización parcial local.
router.delete('/:id', localOnly, productController.deleteProduct); // Permite eliminar productos solo en local.

module.exports = router; // Exporta las rutas para conectarlas con la aplicación.
