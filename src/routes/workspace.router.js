const express = require('express');
const router = express.Router();
const WorkspaceController = require('../controllers/workspace.controller');
const { isWorkspaceAdmin } = require('../middlewares/workspace.middleware');

router.post('/', WorkspaceController.createWorkspace);
router.get('/', WorkspaceController.getListWorkspace);
router.get('/:workspaceId', WorkspaceController.getWorkspaceById);
router.post('/:workspaceId', isWorkspaceAdmin, WorkspaceController.updateWorkspace);
router.delete('/:workspaceId', isWorkspaceAdmin, WorkspaceController.deleteWorkspace);

router.post('/:workspaceId/members', WorkspaceController.addMember);
router.get('/:workspaceId/users', WorkspaceController.findUsers);
//Sprint
router.post('/:workspaceId/sprints', isWorkspaceAdmin, WorkspaceController.createSprint);
router.get('/:workspaceId/sprints', WorkspaceController.getSprints);

//Task
router.get('/:workspaceId/tasks', WorkspaceController.getTasks);

module.exports = router;
