const { Router } = require('express');

const { authMiddleware } = require('../middlewares');
const { todoController } = require('../controllers');

const router = Router();

router.use(authMiddleware.protect);

router.post('/', todoController.createTodo);
router.get('/', todoController.getTodosList);

module.exports = router;
