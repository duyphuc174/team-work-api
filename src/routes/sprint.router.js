const express = require('express');
const router = express.Router();
const SprintController = require('../controllers/sprint.controller');
const { canEditSprint } = require('../middlewares/workspace.middleware');

router.get('/workspaceId', SprintController.getSprintsByWorkspaceId);
router.post('', SprintController.createSprint);
router.post('/:sprintId', SprintController.updateSprint);
router.delete('/:sprintId', SprintController.deleteSprint);

module.exports = router;
