const express = require('express');
const router = express.Router();
const { canEditWork } = require('../middlewares/work.middleware');

const WorkController = require('../controllers/work.controller');

router.post('', WorkController.createWork);
router.get('/sprint/:sprintId', WorkController.getWorksBySprintId);
router.post('/:workId', canEditWork, WorkController.updateWork);
router.delete('/:workId', canEditWork, WorkController.deleteWork);
router.get('/:workId', WorkController.getWorkById);

module.exports = router;
