const db = require('../models');
const { verifyToken } = require('../services/auth.service');

const User = db.User;
const Role = db.Role;

const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra xem có token gửi lên không
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Yêu cầu chưa được xác thực!' });
  }
  try {
    const token = authHeader.slice(7);
    const decodedToken = verifyToken(token);
    const id = decodedToken.id;

    let user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt', 'roleId'],
      },
      include: [
        {
          model: Role,
          exclude: ['createdAt', 'updatedAt'],
          as: 'role',
        },
      ],
    });
    if (!user) {
      return res.status(401).json({ message: 'Người dùng không tồn tại!' });
    }
    if (!user.isActive) {
      return res.status(401).json({ message: 'Người dùng không hoạt động!' });
    }
    if (user.deletedAt) {
      return res.status(401).json({ message: 'Người dùng đã bị xoá!' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Token không hợp lệ!' });
  }
};

const isAdmin = async (req, res, next) => {
  const user = req.user;
  const u = await db.User.findOne({ where: { id: user.id } });
  if (u.roleId !== 1) {
    return res.status(403).json({ message: 'Chỉ admin mới có quyền truy cập!' });
  }
  next();
};

module.exports = { isAuth, isAdmin };
