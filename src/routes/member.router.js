const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/member.controller');

router.get('/workspace/:workspaceId', MemberController.getMembersByWorkspaceId);
router.get('', MemberController.getMembers);
router.post('/:memberId', MemberController.updateRole);
router.post('/delete/muiltiple', MemberController.deleteMembers);
router.post('/workspace/:workspaceId/access', MemberController.updateAccessWorkspace);

module.exports = router;
