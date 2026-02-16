const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);
router.get('/register', authController.getRegisterPage); // Changed from /login/register to /register for cleaner URL
router.post('/register', authController.register);
router.get('/logout', authController.logout);

module.exports = router;
