const express = require('express');
const router = express.Router();
const { isAdmin } = require('./../middlewares/auth.middleware');

const UserController = require('../controllers/user.controller');

router.get('/search', UserController.searchUsers);
router.post('/information', UserController.updateInformation);
router.get('/information/:userId', UserController.getListCommonWorkspaces);

// Admin edit users
router.post('', isAdmin, UserController.createUser);
router.post('/:userId', isAdmin, UserController.updateUser);
router.get('', isAdmin, UserController.getUsers);

module.exports = router;
