const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');

router.get('', TaskController.getTasks);
router.post('', TaskController.createTask);
router.post('/:taskId', TaskController.updateTask);
router.delete('/:taskId', TaskController.deleteTask);

module.exports = router;
