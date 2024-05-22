const db = require('../models');
const WorkService = require('./work.service');

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

  deleteSprint: async (sprintId) => {
    const sprintDelete = await db.Sprint.destroy({ where: { id: sprintId } });
    const works = await db.Work.findAll({ where: { sprintId } });
    const workIds = works.map((work) => work.id);
    await WorkService.deleteWorks(workIds);
    if (!sprintDelete) {
      return null;
    }
    return { message: 'Xoá sprint thành công!', success: true };
  },

  deleteSprints: async (sprintIds) => {
    const sprintDeleted = sprintIds.forEach(async (sprintId) => {
      const sprintDelete = await db.Sprint.destroy({ where: { id: sprintId } });
      const works = await db.Work.findAll({ where: { sprintId } });
      const workIds = works.map((work) => work.id);
      await WorkService.deleteWorks(workIds);
    });
    if (!sprintDeleted) {
      return null;
    }
    return { message: 'Xoá sprint thành công!', success: true };
  },
};

module.exports = SprintService;
