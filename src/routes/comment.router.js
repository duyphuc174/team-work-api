const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment.controller');

router.post('', CommentController.createComment);
router.get('/task/:taskId', CommentController.getCommentByTaskId);
router.delete('/:commentId', CommentController.deleteComment);

module.exports = router;
