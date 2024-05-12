const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');

router.get('/search', UserController.getUsers);
router.post('/information', UserController.updateInformation);

module.exports = router;
