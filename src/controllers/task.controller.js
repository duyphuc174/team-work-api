const { Op, where } = require('sequelize');
const db = require('../models');
const Work = db.Work;
const Task = db.Task;
const Workspace = db.Workspace;
const User = db.User;
const Important = db.Important;
const Sprint = db.Sprint;
const Member = db.Member;

const TaskController = {
  createTask: async (req, res) => {
    try {
      const user = req.user;
      const { title, description, workId, assigneeId, important, deadline } = req.body;
      const task = await Task.create({
        title,
        description,
        workId,
        assigneeId: assigneeId || user.id,
        important: important || 1,
        deadline: deadline || null,
        isComplete: false,
      });
      if (!task) {
        return res.status(400).json({ message: 'Tạo task không thành công' });
      }
      return res.status(200).json(task);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Tạo task thất bại', error });
    }
  },

  updateTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { title, description, assigneeId, important, deadline, isComplete } = req.body;
      const task = await Task.findOne({ where: { id: taskId } });
      if (!task) {
        return res.status(404).json({ message: 'Không tìm thấy task' });
      }
      const taskUpdate = {
        title: title ?? task.title,
        description: description ?? task.description,
        assigneeId: assigneeId ?? task.assigneeId,
        important: important ?? task.important,
        deadline: deadline ?? task.deadline,
        isComplete: isComplete ?? task.isComplete,
      };
      const updateTask = await Task.update(taskUpdate, {
        where: {
          id: task.id,
        },
        returning: true,
      });
      if (!updateTask) {
        return res.status(500).json({ message: 'Cập nhật task thất bại' });
      }
      return res.status(200).json(updateTask);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Cập nhật task thất bại' });
    }
  },

  getTasks: async (req, res) => {
    try {
      const { workId } = req.query;
      const tasks = await Task.findAll({
        where: { workId },
        attributes: ['id', 'title', 'description', 'important', 'deadline', 'isComplete'],
        include: [{ model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'] }],
      });
      if (!tasks) {
        return res.status(404).json({ message: 'Không tìm thấy task' });
      }
      return res.status(200).json(tasks);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập thất bại' });
    }
  },

  getTaskById: async (req, res) => {},

  deleteTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findOne({ where: { id: taskId } });
      if (!task) {
        return res.status(404).json({ message: 'Không tìm thấy task' });
      }
      const deleteTask = await Task.destroy({ where: { id: taskId } });
      if (!deleteTask) {
        return res.status(500).json({ message: 'Xoá task thất bại' });
      }
      return res.status(200).json({ message: 'Xoá task thành công', status: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Xoá task thất bại' });
    }
  },
};

module.exports = TaskController;
