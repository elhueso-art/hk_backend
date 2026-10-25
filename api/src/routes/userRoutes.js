const express = require('express'); // Carga Express para crear rutas HTTP.
const router = express.Router(); // Crea el enrutador de usuarios.
const userController = require('../controllers/userController'); // Importa los controladores.

router.post('/', userController.createUser); // Crea un usuario local de prueba.
router.get('/', userController.listUsers); // Lista usuarios locales.
router.get('/:id', userController.getUser); // Consulta un usuario local.
router.put('/:id', userController.updateUser); // Modifica campos explícitamente permitidos.
router.delete('/:id', userController.deleteUser); // Desactiva el usuario sin borrarlo.

module.exports = router; // Exporta las rutas de usuarios.
