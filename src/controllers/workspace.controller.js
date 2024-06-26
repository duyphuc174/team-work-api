const { where, Op } = require('sequelize');
const db = require('../models');
const NotificationService = require('../services/notification.service');
const SprintService = require('../services/sprint.service');
const Workspace = db.Workspace;
const Member = db.Member;
const User = db.User;
const Sprint = db.Sprint;

const WorkspaceController = {
  getListWorkspace: async (req, res) => {
    const user = req.user;
    try {
      const workspaceList = await Workspace.findAll({
        attributes: {
          exclude: ['deletedAt', 'creatorId'],
        },
        include: [
          {
            model: Member,
            where: { userId: user.id },
            attributes: { exclude: ['userId', 'workspaceId', 'deletedAt'] },
            as: 'myInfo',
            include: {
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
              as: 'user',
            },
          },
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
            as: 'creator',
          },
        ],
      });
      return res.status(200).json(workspaceList);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Không thể lấy danh sách workspace!' });
    }
  },
  createWorkspace: async (req, res) => {
    const user = req.user;
    const { name, description } = req.body;

    try {
      const workspace = await Workspace.create({
        name,
        description,
        creatorId: user.id,
      });

      const member = await Member.create({
        workspaceId: workspace.id,
        userId: user.id,
        role: 'creator',
      });

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 30);
      const sprint = await Sprint.create({
        name: 'Chu kỳ chưa đặt tên',
        startDate,
        endDate,
        workspaceId: workspace.id,
        creatorId: user.id,
      });

      return res.status(201).json(workspace);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Tạo workspace thất bại!' });
    }
  },

  getWorkspaceById: async (req, res) => {
    const { workspaceId } = req.params;
    const user = req.user;

    try {
      const u = await Member.findOne({ where: { userId: user.id, workspaceId } });
      if (!u) {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
      }

      const workspace = await Workspace.findOne({
        where: { id: workspaceId },
        attributes: { exclude: ['deletedAt', 'creatorId'] },
        include: [
          {
            model: Member,
            attributes: { exclude: ['userId', 'workspaceId', 'deletedAt'] },
            as: 'members',
            where: {},
            include: {
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'phoneNumber'],
              as: 'user',
            },
          },
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
            as: 'creator',
          },
          {
            model: db.Member,
            attributes: ['id', 'role'],
            as: 'myInfo',
            where: { userId: user.id },
          },
        ],
      });

      if (!workspace) {
        return res.status(404).json({ message: 'Không tìm thấy workspace!' });
      }

      return res.status(200).json(workspace);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  updateWorkspace: async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const { name, description } = req.body;

      const workspace = await Workspace.findOne({ where: { id: workspaceId } });
      if (!workspace) {
        return res.status(404).json({ message: 'Không tìm thấy workspace!' });
      }

      const dataUpdate = { name, description };
      const workspaceUpdate = Workspace.update(dataUpdate, { where: { id: workspace.id } });

      if (!workspaceUpdate) {
        return res.status(500).json({ message: 'Cập nhật workspace thất bại!' });
      }

      return res.status(200).json({ message: 'Cập nhật workspace thành công', success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  deleteWorkspace: async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const workspace = await Workspace.findOne({ where: { id: workspaceId } });
      if (!workspace) {
        return res.status(404).json({ message: 'Không tìm thấy workspace!' });
      }

      const deleted = await Workspace.destroy({ where: { id: workspace.id } });
      if (!deleted) {
        return res.json({ message: 'Xóa thất bại!' });
      }
      const sprints = await Sprint.findAll({ where: { workspaceId: workspaceId } });
      const sprintIds = sprints.map((sprint) => sprint.id);
      await SprintService.deleteSprints(sprintIds);
      return res.status(200).json({ message: 'Xoá workspace thành công', success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  addMember: async (req, res) => {
    const { workspaceId } = req.params;
    const { userIds } = req.body;
    const user = req.user;

    try {
      const workspace = await Workspace.findOne({
        where: { id: workspaceId },
      });

      if (!workspace) {
        return res.status(404).json({ message: 'Không tìm thấy workspace!' });
      }

      const u = await Member.findOne({ where: { userId: user.id, workspaceId } });
      if (u.role !== 'creator' && u.role !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa!' });
      }

      for (let userId of userIds) {
        const u = await User.findOne({ where: { id: userId } });
        if (!u) {
          continue;
        }
        const m = await Member.findOne({ where: { userId, workspaceId } });
        if (m) {
          continue;
        }
        await Member.create({
          workspaceId: workspace.id,
          userId: userId,
        });

        NotificationService.createNotification({
          content: `[${user.firstName} ${user.lastName}] đã thêm bạn vào nhóm [${workspace.name}]`,
          link: `/workspaces/${workspace.id}`,
          type: 'member',
          receiverId: userId,
          senderId: user.id,
          workspaceId: workspace.id,
        });
      }

      return res.status(200).json({ message: 'Thêm thành viên vào workspace thành công' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  findUsers: async (req, res) => {
    const { workspaceId } = req.params;
    const { find } = req.query;

    try {
      const members = await Member.findAll({
        where: { workspaceId },
        attributes: ['userId'],
      });

      const memberIds = members.map((member) => member.userId);

      const users = await User.findAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.like]: `%${find || ''}%` } },
            { lastName: { [Op.like]: `%${find || ''}%` } },
            { email: { [Op.like]: `%${find || ''}%` } },
          ],
          id: { [Op.notIn]: memberIds },
        },
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'email'],
      });
      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  createSprint: async (req, res) => {
    const { workspaceId } = req.params;
    const user = req.user;
    const { name, startDate, endDate } = req.body;
    try {
      const sprint = await Sprint.create({
        name,
        startDate,
        endDate,
        workspaceId,
        creatorId: user.id,
      });
      return res.status(200).json(sprint);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  getSprints: async (req, res) => {
    const { workspaceId } = req.params;
    try {
      const sprints = await Sprint.findAll({
        where: { workspaceId },
      });
      return res.status(200).json(sprints);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  getTasks: async (req, res) => {
    try {
      const user = req.user;
      const { workspaceId } = req.params;
      const { sortBy, find, completed } = req.query;

      const works = await db.Work.findAll({
        include: [
          {
            model: db.Sprint,
            where: {
              workspaceId,
            },
            as: 'sprint',
          },
        ],
      });
      const workIds = works.map((work) => work.id);

      let order = [];
      if (sortBy) {
        if (sortBy === 'important') {
          order = ['important', 'DESC'];
        }
        if (sortBy === 'deadline') {
          order = ['deadline', 'DESC'];
        }
      } else {
        order = ['id', 'ASC'];
      }

      const condition = {
        assigneeId: user.id,
      };
      if (completed) {
        condition.completed = completed === 'true' ? true : false;
      }

      const tasks = await db.Task.findAll({
        where: {
          ...condition,
          title: { [Op.like]: `%${find || ''}%` },
        },
        order: [['completed', 'ASC'], order],
        attributes: ['id', 'title', 'description', 'important', 'deadline', 'completed'],
        include: [
          {
            model: User,
            as: 'assignee',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
          },
          {
            model: db.Work,
            where: {
              id: {
                [Op.in]: workIds || [],
              },
            },
            attributes: ['id', 'title'],
            as: 'work',
          },
        ],
      });

      if (!tasks) {
        return res.status(404).json({ message: 'Không tìm thấy task' });
      }
      return res.status(200).json(tasks);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  getNotifications: async (req, res) => {
    try {
      const user = req.user;
      const { workspaceId } = req.params;
      const { limit, offset, type } = req.query;

      const read = type === 'read' ? true : false;

      const notifications = await db.Notification.findAll({
        where: {
          receiverId: user.id,
          workspaceId,
          read,
        },
        limit: +limit || 10,
        offset: +offset || 0,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'content', 'read', 'workspaceId', 'type', 'link', 'createdAt'],
      });

      const notiReadCount = await db.Notification.count({
        where: {
          receiverId: user.id,
          workspaceId,
          read: true,
        },
      });

      const notiUnreadCount = await db.Notification.count({
        where: {
          receiverId: user.id,
          workspaceId,
          read: false,
        },
      });

      if (!notifications) {
        return res.status(404).json({ message: 'Không tìm thấy notifications!' });
      }

      return res.status(200).json({ notifications, notiReadCount, notiUnreadCount });
    } catch (error) {}
  },
};

module.exports = WorkspaceController;
