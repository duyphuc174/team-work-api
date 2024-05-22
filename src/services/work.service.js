const db = require('../models');
const TaskService = require('./task.service');

const WorkService = {
  deleteWork: async (workId) => {
    const workDeleted = await db.Work.destroy({ where: { id: workId } });
    const tasks = await db.Task.findAll({ where: { workId } });
    const taskIds = tasks.map((task) => task.id);
    await TaskService.deleteTasks(taskIds);
    return workDeleted;
  },
  deleteWorks: async (workIds) => {
    workIds.forEach(async (workId) => {
      await db.Work.destroy({ where: { id: workId } });
      const tasks = await db.Task.findAll({ where: { workId } });
      const taskIds = tasks.map((task) => task.id);
      await TaskService.deleteTasks(taskIds);
    });
  },
};

module.exports = WorkService;
