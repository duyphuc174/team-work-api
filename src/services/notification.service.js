const db = require('../models');

const NotificationService = {
  createNotification: async (data) => {
    const { receiverId, senderId, workspaceId, content, link, type } = data;
    const notification = await db.Notification.create({
      content,
      link,
      type,
      receiverId,
      senderId,
      workspaceId,
    });
    if (!notification) {
      return null;
    }
    return notification;
  },
};

module.exports = NotificationService;
