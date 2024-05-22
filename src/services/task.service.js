const db = require('../models');

const TaskService = {
  deleteTasks: async (taskIds) => {
    return taskIds.forEach(async (taskId) => {
      await db.Task.destroy({ where: { id: taskId } });
    });
  },
};

module.exports = TaskService;
