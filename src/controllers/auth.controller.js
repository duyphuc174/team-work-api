const db = require('../models');
const { makeToken, comparePassword, hashPassword } = require('../services/auth.service');
const UserService = require('../services/user.service');

const User = db.User;

// const hashPassword = (password) => {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
// };

const authController = {
  register: async (req, res) => {
    try {
      const body = req.body;

      const userCreated = await UserService.createUser(body);
      console.log(userCreated);
      if (!userCreated) {
        return res.status(500).json({ message: 'Đăng ký thất bại!' });
      }

      // Tạo token
      const token = makeToken(userCreated.id, userCreated.roleId);

      return res.status(201).json({ userCreated, token });
    } catch (error) {
      res.status(500).json({ message: 'Đăng ký thất bại!' });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Kiểm tra xem người dùng có tồn tại không
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác!' });
      }

      // Giải mã và kiểm tra mật khẩu
      const passwordMatch = comparePassword(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác!' });
      }

      // Tạo token
      const token = makeToken(user.id, user.roleId);

      return res.status(200).json({ token });
    } catch (error) {}
  },

  changePassword: async (req, res) => {
    try {
      const user = req.user;
      const { oldPassword, newPassword } = req.body;

      const u = await db.User.findOne({ where: { id: user.id } });
      if (!u) {
        return res.status(404).json({ message: 'Không thể tìm thấy người dùng!' });
      }

      const passwordMatch = comparePassword(oldPassword, u.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: 'Mật không chính xác!' });
      }

      const hashedPassword = hashPassword(newPassword);

      const userUpdated = await db.User.update({ password: hashedPassword }, { where: { id: user.id } });

      if (!userUpdated) {
        return res.status(500).json({ message: 'Cập nhật mật khẩu thất bại!' });
      }

      return res.status(200).json({ message: 'Cập nhật mật khẩu thành công!', success: true });
    } catch (error) {
      ErrorService.errorResponse(res, error);
    }
  },

  getProfile: async (req, res) => {
    const user = req.user;
    return res.status(200).json(user);
  },
};

module.exports = authController;
