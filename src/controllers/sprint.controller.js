const { where, Op } = require('sequelize');
const db = require('../models');
const SprintService = require('../services/sprint.service');

const SprintController = {
  getSprintsByWorkspaceId: async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const sprints = await db.Sprint.findAll({
        where: { workspaceId },
        attributes: ['id', 'name', 'startDate', 'endDate'],
      });
      if (!sprints) {
        return res.status(404).json({ message: 'Không tìm thấy sprints!' });
      }
      return res.status(200).json(sprints);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  createSprint: async (req, res) => {
    try {
      const user = req.user;
      const body = req.body;
      const { workspaceId } = req.body;

      const member = await db.Member.findOne({ where: { userId: user.id, workspaceId } });
      if (member.role === 'member') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
      }

      const sprintCreate = await SprintService.createSprint(user, body);

      if (!sprintCreate) {
        return res.status(500).json({ message: 'Không thể tạo sprint!' });
      }

      return res.status(200).json(sprintCreate);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  updateSprint: async (req, res) => {
    try {
      const user = req.user;
      const { sprintId } = req.params;
      const { name, startDate, endDate } = req.body;

      const sprint = await db.Sprint.findOne({ where: { id: sprintId } });
      if (!sprint) {
        return res.status(404).json({ message: 'Không tìm thấy sprint!' });
      }

      const workspaceId = sprint.workspaceId;
      const member = await db.Member.findOne({ where: { userId: user.id, workspaceId } });
      if (member.role === 'member') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
      }

      dataUpdate = {
        name: name ?? sprint.name,
        startDate: startDate ?? sprint.startDate,
        endDate: endDate ?? sprint.endDate,
      };
      const sprintUpdate = await SprintService.updateSprint(sprintId, dataUpdate);
      if (!sprintUpdate) {
        return res.status(500).json({ message: 'Có lỗi xảy ra!' });
      }

      return res.status(200).json(sprintUpdate);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  deleteSprint: async (req, res) => {
    try {
      const user = req.user;
      const { sprintId } = req.params;
      const sprint = await db.Sprint.findOne({ where: { id: sprintId } });
      if (!sprint) {
        return res.status(404).json({ message: 'Không tìm thấy sprint!' });
      }
      const workspaceId = sprint.workspaceId;
      const member = await db.Member.findOne({ where: { userId: user.id, workspaceId } });
      if (member.role === 'member') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
      }

      const sprintDelete = await SprintService.deleteSprint(sprint.id);
      if (!sprintDelete) {
        return res.status(500).json({ message: 'Không thể xóa sprint!' });
      }
      return res.status(200).json({ message: 'Xoá sprint thành công!', success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },
};

module.exports = SprintController;
