const { where, Op } = require('sequelize');
const db = require('../models');
const Member = db.Member;
const User = db.User;

const MemberController = {
  getMembersByWorkspaceId: async (req, res) => {
    try {
      const { workspaceId } = req.params;

      const members = await Member.findAll({
        where: { workspaceId },
        include: {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'avatar', 'email', 'phoneNumber'],
          as: 'user',
        },
        attributes: ['id', 'role'],
      });
      if (!members) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
      return res.status(200).json(members);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  getMembers: async (req, res) => {
    try {
      const { workspaceId } = req.query;
      const members = await Member.findAll({
        where: { workspaceId },
      });
      const listFilter = members.map((member) => member.userId);
      const users = await User.findAll({
        where: { id: { [Op.in]: listFilter } },
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'email', 'phoneNumber'],
      });
      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  updateRole: async (req, res) => {
    try {
      const user = req.user;
      const { memberId } = req.params;
      const { role } = req.body;

      const m = await Member.findOne({ where: { id: memberId } });

      if (!m) {
        res.status(403).json({ message: 'Không tìm thấy member!' });
      }
      const workspaceId = m.workspaceId;
      const member = await Member.findOne({ where: { userId: user.id, workspaceId } });

      if (member.role === 'member') {
        res.status(403).json({ message: 'Không có quyền truy cập!' });
      }

      const dataUpdate = { role };

      const memberUpdate = await Member.update(dataUpdate, { where: { id: m.id } });

      if (!memberUpdate) {
        return res.status(500).json({ message: 'Có lỗi xảy ra!' });
      }

      return res.status(200).json({ message: 'Thay đổi quyền thành công!', success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },

  deleteMembers: async (req, res) => {
    try {
      const user = req.user;
      const { workspaceId, memberIds } = req.body;

      const m = await Member.findOne({ where: { userId: user.id, workspaceId } });
      if (!m) {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
      }
      if (m.role !== 'admin' && m.role !== 'creator') {
        return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa!' });
      }

      for (let memberId of memberIds) {
        const member = await Member.findOne({ where: { id: memberId } });
        if (!member) {
          continue;
        }
        if (m.workspaceId !== member.workspaceId) {
          continue;
        }
        await Member.destroy({ where: { id: member.id } });
      }

      return res.status(200).json({ message: 'Xoá thành công!', success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Lỗi truy cập!' });
    }
  },
};

module.exports = MemberController;
