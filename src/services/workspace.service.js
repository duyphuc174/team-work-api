const db = require('../models');
const Workspace = db.Workspace;
const Member = db.Member;

const getMembers = async (workspaceId) => {
  return await Member.findAll({
    where: { workspaceId }, // Chỉ lấy các member thuộc workspace có id là workspaceId
    include: {
      model: User, // Kết nối với model User để lấy thông tin của các thành viên
      attributes: ['id', 'name', 'email'], // Chỉ lấy các thuộc tính cần thiết của user
    },
  });
};

module.exports = {
  getMembers,
};
