const db = require('../models');
const { makeToken, comparePassword, hashPassword } = require('../services/auth.service');

const User = db.User;

// const hashPassword = (password) => {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
// };

const authController = {
  register: async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã tồn tại!' });
      }

      // Mã hóa password
      const hashedPassword = hashPassword(password);

      // Tạo user
      const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        roleId: 2,
      });

      // Tạo token
      const token = makeToken(user.id, user.roleId);

      return res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ message: 'Đăng ký thất bại!' });
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

  getProfile: async (req, res) => {
    const user = req.user;
    return res.status(200).json(user);
  },
};

module.exports = authController;
