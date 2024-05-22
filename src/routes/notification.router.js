const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification.controller');

router.get('', NotificationController.getNotifications);
router.post('/:notiId/mark-read', NotificationController.markReadNoti);

module.exports = router;
