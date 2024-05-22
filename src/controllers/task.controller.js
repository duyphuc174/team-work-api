const { Op, where } = require('sequelize');
const db = require('../models');
const NotificationService = require('../services/notification.service');
const { deleteFile } = require('./work.controller');
const Task = db.Task;
const User = db.User;

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
        completed: false,
      });
      if (!task) {
        return res.status(400).json({ message: 'Tạo task không thành công' });
      }
      return res.status(200).json(task);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Tạo task thất bại' });
    }
  },

  updateTask: async (req, res) => {
    try {
      const user = req.user;
      const { taskId } = req.params;
      const { title, description, assigneeId, important, deadline, completed } = req.body;
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
        completed: completed ?? task.completed,
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

      const work = await db.Work.findOne({
        where: { id: task.workId },
        include: [
          {
            model: db.Sprint,
            as: 'sprint',
            attributes: ['id'],
            include: [
              {
                model: db.Workspace,
                as: 'workspace',
                attributes: ['id'],
              },
            ],
          },
        ],
      });

      if (!work) {
        return res.status(500).json({ message: 'Không tìm thấy work!' });
      }

      const workspaceId = work.sprint.workspace.id;

      if (assigneeId && assigneeId !== user.id) {
        NotificationService.createNotification({
          content: `[${user.firstName} ${user.lastName}] đã chỉ định bạn làm người thực hiện công việc [${task.title}]`,
          link: `/workspaces/${workspaceId}/works/${work.id}?taskId=${task.id}`,
          type: 'task',
          receiverId: assigneeId,
          senderId: user.id,
          workspaceId,
        });
      }
      return res.status(200).json({ message: 'Cập nhật task thành công', success: true });
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
        attributes: ['id', 'title', 'description', 'important', 'deadline', 'completed'],
        include: [
          { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'] },
          { model: db.TaskFileStorage, as: 'files', attributes: ['id', 'name', 'link', 'type'] },
        ],
        order: [
          ['completed', 'ASC'],
          ['id', 'ASC'],
        ],
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

  getTaskById: async (req, res) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findOne({
        where: { id: taskId },
        attributes: ['id', 'title', 'description', 'important', 'deadline', 'completed'],
        include: [{ model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'] }],
      });
      if (!task) {
        return res.status(404).json({ message: 'Không tìm thấy task' });
      }
      return res.status(200).json(task);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập thất bại' });
    }
  },

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

  addFiles: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { files } = req.body;

      const task = await db.Task.findOne({ where: { id: taskId } });

      if (!task) {
        return res.status(404).json({ message: 'Không tìm thấy task!' });
      }

      const filesCreatePromises = files.map((file) => {
        return db.TaskFileStorage.create({
          taskId: task.id,
          link: file.path,
          name: file.name,
          type: file.type,
        });
      });

      const filesCreate = await Promise.all(filesCreatePromises);

      return res.status(200).json({ message: 'Thêm files thành công', success: true, files: filesCreate });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Có lỗi xảy ra!' });
    }
  },

  deleteFile: async (req, res) => {
    try {
      const { fileId } = req.params;
      const taskFile = await db.TaskFileStorage.findOne({ where: { id: fileId } });
      if (!taskFile) {
        return res.status(404).json({ message: 'Không tìm thấy file!' });
      }
      const taskFileDelete = await db.TaskFileStorage.destroy({ where: { id: taskFile.id } });
      if (!taskFileDelete) {
        return res.status(404).json({ message: 'Xoá file thất bại!' });
      }
      return res.status(200).json({ message: 'Xoá file thành công!', success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Có lỗi xảy ra!' });
    }
  },
};

module.exports = TaskController;
