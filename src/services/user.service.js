const db = require('../models');
const { hashPassword } = require('../services/auth.service');

const UserService = {
  createUser: async (body) => {
    const { email, password, firstName, lastName } = body;

    // Kiểm tra email đã tồn tại hay chưa
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return null;
    }

    // Mã hoá password
    const hashedPassword = hashPassword(password);

    // Tạo user
    const userCreated = await db.User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      roleId: 2,
    });

    return userCreated;
  },

  updateUser: async (id, body, roleId = null) => {
    const { firstName, lastName, avatar, address, description, birthday, phone } = body;

    const existingUser = await db.User.findOne({ where: { id } });
    if (!existingUser) {
      return null;
    }

    const dataUpdate = {
      firstName: firstName ?? existingUser.firstName,
      lastName: lastName ?? existingUser.lastName,
      avatar: avatar ?? existingUser.avatar,
      address: address ?? existingUser.address,
      description: description ?? existingUser.description,
      birthday: birthday ?? existingUser.birthday,
      phoneNumber: phone ?? existingUser.phoneNumber,
    };

    if (roleId) {
      dataUpdate.roleId = roleId;
    }

    const userUpdated = await db.User.update(dataUpdate, { where: { id: existingUser.id } });

    return userUpdated;
  },
};

module.exports = UserService;
