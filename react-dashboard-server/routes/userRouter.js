const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAll)
router.post('/', userController.create)
router.patch('/:id', userController.update)
router.delete('/:id', userController.del)

module.exports = router