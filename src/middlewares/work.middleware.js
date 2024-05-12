const db = require('../models');

const canEditWork = async (req, res, next) => {
  const { workId } = req.params;
  const work = await db.Work.findOne({ where: { id: workId } });
  const sprint = await db.Sprint.findOne({ where: { id: work.sprintId } });
  const member = await db.Member.findOne({ where: { userId: req.user.id, workspaceId: sprint.workspaceId } });
  if (member.role !== 'admin' && member.role !== 'creator' && work.followerId !== req.user.id) {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
  }
  next();
};

module.exports = { canEditWork };
