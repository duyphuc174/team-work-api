const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const uploadCloud = require('../middlewares/upload.cloudinary');

router.post('/', uploadCloud.array('files', 10), uploadController.uploadFiles);

module.exports = router;
