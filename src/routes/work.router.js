const express = require('express');
const router = express.Router();
const { canEditWork } = require('../middlewares/work.middleware');

const WorkController = require('../controllers/work.controller');

router.post('', WorkController.createWork);
router.get('/sprint/:sprintId', WorkController.getWorksBySprintId);
router.post('/:workId', canEditWork, WorkController.updateWork);
router.delete('/:workId', canEditWork, WorkController.deleteWork);
router.get('/:workId', WorkController.getWorkById);
router.post('/:workId/files', canEditWork, WorkController.addFiles);
router.delete('/:workId/files/:fileId', canEditWork, WorkController.deleteFile);

// Assignee
router.post('/:workId/assignees', canEditWork, WorkController.updateAssignees);
module.exports = router;
