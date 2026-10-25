const express = require('express'); // Carga Express para definir rutas HTTP.
const router = express.Router(); // Crea un enrutador para los productos.
const productController = require('../controllers/productController'); // Importa los controladores de producto.

router.get('/', productController.listProducts); // Expone el listado y los filtros del catálogo.
router.get('/:id', productController.getProduct); // Expone la consulta de un producto.
router.post('/', productController.createProduct); // Expone la creación de productos.
router.patch('/:id', productController.updateProduct); // Expone la actualización parcial.
router.delete('/:id', productController.deleteProduct); // Expone la eliminación de productos.

module.exports = router; // Exporta las rutas para conectarlas con la aplicación.
