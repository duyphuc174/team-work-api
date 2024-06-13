const express = require('express');
const router = express.Router();
const WorkspaceController = require('../controllers/workspace.controller');
const { isWorkspaceAdmin, isWorkspaceMember } = require('../middlewares/workspace.middleware');

router.post('/', WorkspaceController.createWorkspace);
router.get('/', WorkspaceController.getListWorkspace);
router.get('/:workspaceId', isWorkspaceMember, WorkspaceController.getWorkspaceById);
router.post('/:workspaceId', isWorkspaceAdmin, WorkspaceController.updateWorkspace);
router.delete('/:workspaceId', isWorkspaceAdmin, WorkspaceController.deleteWorkspace);

router.post('/:workspaceId/members', isWorkspaceAdmin, WorkspaceController.addMember);
router.get('/:workspaceId/users', isWorkspaceMember, WorkspaceController.findUsers);
//Sprint
router.post('/:workspaceId/sprints', isWorkspaceAdmin, WorkspaceController.createSprint);
router.get('/:workspaceId/sprints', isWorkspaceMember, WorkspaceController.getSprints);

//Task
router.get('/:workspaceId/tasks', isWorkspaceMember, WorkspaceController.getTasks);

// Notification
router.get('/:workspaceId/notifications', isWorkspaceMember, WorkspaceController.getNotifications);

module.exports = router;
