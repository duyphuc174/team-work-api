const db = require('../models');

const CommentController = {
  createComment: async (req, res) => {
    try {
      const user = req.user;
      const { taskId, content } = req.body;

      const comment = await db.Comment.create({
        taskId,
        content,
        creatorId: user.id,
      });

      if (!comment) {
        return res.status(500).json({ message: 'Không thể tạo comment!' });
      }
      return res.status(200).json(comment);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  getCommentByTaskId: async (req, res) => {
    try {
      const user = req.user;
      const { taskId } = req.params;

      const comments = await db.Comment.findAll({
        where: { taskId },
        include: [
          {
            model: db.User,
            attributes: ['id', 'firstName', 'lastName', 'avatar', 'email'],
            as: 'creator',
          },
        ],
        attributes: ['id', 'content', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });

      if (!comments) {
        return res.status(404).json({ message: 'Không tìm thấy comments' });
      }
      return res.status(200).json(comments);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const user = req.user;
      const { commentId } = req.params;

      const comment = await db.Comment.findOne({
        where: { id: commentId, creatorId: user.id },
      });

      if (!comment) {
        return res.status(404).json({ message: 'Không tìm thấy comment' });
      }

      const deleteComment = await db.Comment.destroy({
        where: { id: commentId },
      });

      if (!deleteComment) {
        return res.status(500).json({ message: 'Xoá comment thất bại' });
      }
      return res.status(200).json({ message: 'Xoá comment thành công', success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Xoá comment thất bại' });
    }
  },
};

module.exports = CommentController;
