const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/member.controller');

router.get('/:workspaceId', MemberController.getMembersByWorkspaceId);
router.get('', MemberController.getMembers);
router.post('/:memberId', MemberController.updateRole);
router.post('/delete/muiltiple', MemberController.deleteMembers);

module.exports = router;
