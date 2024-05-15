const { Op, where } = require('sequelize');
const db = require('../models');
const UserService = require('../services/user.service');
const ErrorService = require('../services/error.service');
const User = db.User;
const Role = db.Role;
const { comparePassword } = require('../services/auth.service');

const UserController = {
  createUser: async (req, res) => {
    try {
      const body = req.body;
      const userCreated = await UserService.createUser(body);

      if (!userCreated) {
        return res.status(500).json({ message: 'Không thể tạo người dùng!' });
      }

      return res.status(201).json(userCreated);
    } catch (error) {
      ErrorService.errorResponse(res, error);
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = req.user;
      const { userId } = req.params;
      const { roleId } = req.body;
      const body = req.body;

      const userUpdated = await UserService.updateUser(userId, body, roleId);

      if (!userUpdated) {
        return res.status(404).json({ message: 'Cập nhật người dùng thất bại!' });
      }

      return res.status(200).json(userUpdated);
    } catch (error) {
      ErrorService.errorResponse(res, error);
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: [
          'id',
          'firstName',
          'lastName',
          'avatar',
          'email',
          'phoneNumber',
          'address',
          'description',
          'birthday',
        ],
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name'],
          },
        ],
      });

      if (!users) {
        return res.status(404).json({ message: 'Không thể lấy danh sách người dùng!' });
      }

      return res.status(200).json(users);
    } catch (error) {
      ErrorService.errorResponse(res, error);
    }
  },

  searchUsers: async (req, res) => {
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
      ErrorService.errorResponse(res, error);
    }
  },

  updateInformation: async (req, res) => {
    try {
      const user = req.user;
      const body = req.body;

      const userUpdated = await UserService.updateUser(user.id, body);
      if (!userUpdated) {
        return res.status(404).json({ message: 'Cập nhật thông tin thất bại' });
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
      ErrorService.errorResponse(res, error);
    }
  },
};

module.exports = UserController;
