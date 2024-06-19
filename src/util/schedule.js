const schedule = require('node-schedule');
const db = require('../models');
const { where, Op } = require('sequelize');
const NotificationService = require('../services/notification.service');

const makeExprieTaskNotification = async () => {
  const tasks = await db.Task.findAll({
    where: {
      deadline: {
        [Op.lt]: new Date(),
      },
    },
    include: [
      {
        model: db.Work,
        as: 'work',
        include: [
          {
            model: db.Sprint,
            as: 'sprint',
            include: [
              {
                model: db.Workspace,
                as: 'workspace',
              },
            ],
          },
        ],
      },
    ],
  });
  tasks.forEach(async (task) => {
    await NotificationService.createNotification({
      content: `Task [${task.title}] của công việc ${task.work.title} đã hết hạn!`,
      link: `/workspaces/${task.work.sprint.workspace.id}/works/${task.work.id}/?taskId=${task.id}`,
      type: 'task',
      receiverId: task.assigneeId,
      senderId: null,
      workspaceId: task.work.sprint.workspace.id,
    });
  });
};

const makeExpireWorkNotification = async () => {
  const works = await db.Work.findAll({
    where: {
      endDate: {
        [Op.lt]: new Date(),
      },
    },
    include: [
      {
        model: db.Sprint,
        as: 'sprint',
        include: [
          {
            model: db.Workspace,
            as: 'workspace',
          },
        ],
      },
    ],
  });

  works.forEach(async (work) => {
    await NotificationService.createNotification({
      content: `Công việc [${work.title}] đã quá hạn!`,
      link: `/workspaces/${work.sprint.workspace.id}/works/${work.id}`,
      type: 'work',
      receiverId: work.followerId,
      senderId: null,
      workspaceId: work.sprint.workspace.id,
    });
  });
};

schedule.scheduleJob('0 8 * * *', () => {
  console.log('--------------');
  makeExprieTaskNotification();
  console.log('--------------');
});

schedule.scheduleJob('0 8 * * *', () => {
  console.log('--------------');
  makeExpireWorkNotification();
  console.log('--------------');
});
