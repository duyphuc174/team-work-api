const express = require('express');
const router = express.Router();
const isAuth = require('./../middlewares/auth.middleware');

const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/token', isAuth, authController.getProfile);

module.exports = router;
