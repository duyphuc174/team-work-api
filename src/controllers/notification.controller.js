const db = require('../models');
const ErrorService = require('../services/error.service');

const NotificationController = {
  getNotifications: async (req, res) => {
    try {
      const user = req.user;
      const { limit, offset, type } = req.query;
      const read = type === 'read' ? true : false;
      const notifications = await db.Notification.findAll({
        where: { receiverId: user.id, read },
        limit: +limit || 10,
        offset: +offset || 0,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'content', 'read', 'workspaceId', 'link', 'type', 'createdAt'],
        include: [{ model: db.Workspace, attributes: ['id', 'name'], as: 'workspace' }],
      });

      const notiReadCount = await db.Notification.count({
        where: { receiverId: user.id, read: true },
      });

      const notiUnreadCount = await db.Notification.count({
        where: { receiverId: user.id, read: false },
      });

      return res.status(200).json({ notifications, readCount: notiReadCount, unReadCount: notiUnreadCount });
    } catch (error) {
      ErrorService.errorResponse(res, error);
    }
  },

  markReadNoti: async (req, res) => {
    try {
      const { notiId } = req.params;

      const noti = await db.Notification.findOne({ where: { id: notiId } });
      if (!noti) {
        return res.status(404).json({ message: 'Không tìm thấy thông báo!' });
      }

      await db.Notification.update({ read: true }, { where: { id: notiId } });

      return res.status(200).json({ message: 'Đánh dấu đã đọc thành công!', success: true });
    } catch (error) {}
  },
};

module.exports = NotificationController;
