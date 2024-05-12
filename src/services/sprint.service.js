const { createSprint } = require('../controllers/workspace.controller');
const db = require('../models');

const SprintService = {
  createSprint: async (user, body) => {
    const { name, startDate, endDate, workspaceId } = body;

    const data = {
      name,
      startDate,
      endDate,
      workspaceId,
      creatorId: user.id,
    };

    const sprintCreate = await db.Sprint.create(data);

    return sprintCreate;
  },

  updateSprint: async (sprintId, data) => {
    const sprintUpdate = await db.Sprint.update(data, { where: { id: sprintId } });
    if (!sprintUpdate) {
      return null;
    }
    return { message: 'Cập nhật thành công', success: true };
  },

  getSprintById: async (sprintId, attributes = ['id', 'name', 'startDate', 'endDate']) => {
    const sprint = db.Sprint.findOne({
      where: { id: sprintId },
      attributes,
    });
    return sprint;
  },
};

module.exports = SprintService;
