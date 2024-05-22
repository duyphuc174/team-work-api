const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');

router.get('', TaskController.getTasks);
router.get('/:taskId', TaskController.getTaskById);
router.post('', TaskController.createTask);
router.post('/:taskId', TaskController.updateTask);
router.delete('/:taskId', TaskController.deleteTask);
router.post('/:taskId/files', TaskController.addFiles);
router.delete('/:taskId/files/:fileId', TaskController.deleteFile);

module.exports = router;
