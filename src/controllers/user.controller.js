const { Op, where } = require('sequelize');
const db = require('../models');
const User = db.User;
const Role = db.Role;

const UserController = {
  getUsers: async (req, res) => {
    const user = req.user;
    const { find } = req.query;

    try {
      const users = await User.findAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { email: { [Op.like]: `%${find}%` } },
                { firstName: { [Op.like]: `%${find}%` } },
                { lastName: { [Op.like]: `%${find}%` } },
              ],
            },
            {
              id: { [Op.ne]: user.id },
            },
          ],
        },
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'email'],
      });

      return res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  updateInformation: async (req, res) => {
    const user = req.user;
    const { firstName, lastName, avatar, address, description, birthday, phoneNumber } = req.body;

    try {
      const profile = await User.findOne({
        where: { id: user.id },
      });

      if (!profile) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      profileUpdate = {
        firstName: firstName ?? profile.firstName,
        lastName: lastName ?? profile.lastName,
        avatar: avatar ?? profile.avatar,
        address: address ?? profile.address,
        description: description ?? profile.description,
        birthday: birthday ?? profile.birthday,
        phoneNumber: phoneNumber ?? profile.phoneNumber,
      };

      const userUpdate = await User.update(profileUpdate, {
        where: { id: user.id },
      });

      if (!userUpdate) {
        return res.status(404).json({ message: 'Không thể lưu' });
      }
      let u = await User.findOne({
        where: { id: user.id },
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

      return res.status(200).json(u);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
};

module.exports = UserController;
