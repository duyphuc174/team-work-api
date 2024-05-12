const db = require('../models');

const isWorkspaceAdmin = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const user = req.user;

    const member = await db.Member.findOne({ where: { userId: user.id, workspaceId } });
    if (member.role === 'member') {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lỗi truy cập!' });
  }
};

const canCreateSprint = async (req, res, next) => {
  try {
    const { workspaceId } = req.body;
    const user = req.user;

    const member = await db.Member.findOne({ where: { userId: user.id, workspaceId } });
    if (member.role === 'member') {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lỗi truy cập!' });
  }
};

const canEditSprint = async (req, res, next) => {
  try {
    const { sprintId } = req.params;
    const user = req.user;
    const sprint = await db.Sprint.findOne({ where: { id: sprintId } });
    if (!sprint) {
      return res.status(404).json({ message: 'Không tìm thấy sprint!' });
    }
    const workspaceId = sprint.workspaceId;
    const member = await db.Member.findOne({ where: { userId: user.id, workspaceId } });
    if (member.role === 'member') {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lỗi truy cập!' });
  }
};

module.exports = {
  isWorkspaceAdmin,
  canCreateSprint,
  canEditSprint,
};
