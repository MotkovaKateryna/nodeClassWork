const { Router } = require('express');

const { userController } = require('../controllers');
const { userMiddleware } = require('../middlewares');

const router = Router();

/** HTTP methods==========
 * POST, GET, PUT, PATCH, DELETE
 *
 * REST API (CRUD operations)
 * POST       /users            - create user
 * GET        /users            - get users list
 * GET        /users/<userID>   - get one user
 * PATCH      /users/<userID>   - update one user
 * DELETE     /users/<userID>   - delete one user
 */

// router.post('/', userController.createUser);
// router.get('/', userController.getUsers);
// router.get('/:id', userMiddleware.checkUserId, userController.getUser);
// router.patch('/:id', userMiddleware.checkUserId, userController.getUser);
// router.delete('/:id', userMiddleware.checkUserId, userController.getUser);

router
  .route('/')
  .post(userController.createUser)
  .get(userController.getUsers);

router.use('/:id', userMiddleware.checkUserId);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.getUser)
  .delete(userController.getUser);

module.exports = router;
