const db = require('../models');

const NotificationService = {
  createNotification: async (data) => {
    const { receiverId, content, link, type } = data;
    const notification = await db.Notification.create({
      receiverId,
      content,
      link,
      type,
    });
    if (!notification) {
      return null;
    }
    return notification;
  },
};

module.exports = NotificationService;
