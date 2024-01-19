const { Router } = require('express');

const { authMiddleware } = require('../middlewares');
const { authController } = require('../controllers');

const router = Router();

router.post('/signup', authMiddleware.checkSignupData, authController.signup);
router.post('/login', authMiddleware.checkLoginData, authController.login);

// PASSWORD RESTORE
// 1. send restore password instruction via email
router.post('/forgot-password', authController.forgotPassword);

// 2. update user password (with temporary token (otp))
router.post('/restore-password/:otp', authController.restorePassword);

module.exports = router;
