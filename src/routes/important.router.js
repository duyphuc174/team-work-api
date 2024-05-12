const express = require('express');
const router = express.Router();
const ImportantController = require('../controllers/important.controller');

router.get('', ImportantController.getImportants);

module.exports = router;
