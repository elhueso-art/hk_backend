const express = require('express'); // Carga Express para crear rutas HTTP.
const router = express.Router(); // Crea el enrutador de categorías.
const categoryController = require('../controllers/categoryController'); // Importa los controladores.
const localOnly = require('../middleware/localOnly'); // Restringe cambios de catálogo a desarrollo local.

router.post('/', localOnly, categoryController.createCategory); // Crea categorías solo en local.
router.get('/', categoryController.listCategories); // Lista categorías.
router.get('/:id', categoryController.getCategory); // Consulta una categoría.
router.put('/:id', localOnly, categoryController.updateCategory); // Modifica categorías solo en local.
router.delete('/:id', localOnly, categoryController.deleteCategory); // Elimina categorías no asociadas solo en local.

module.exports = router; // Exporta las rutas de categorías.
