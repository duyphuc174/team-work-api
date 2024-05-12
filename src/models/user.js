'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, { foreignKey: 'roleId', targetKey: 'id', as: 'role' });
      User.hasMany(models.Workspace, { foreignKey: 'creatorId', sourceKey: 'id' });
      User.hasMany(models.Member, { foreignKey: 'userId', sourceKey: 'id', as: 'members' });
      User.hasMany(models.Work, { foreignKey: 'followerId', sourceKey: 'id', as: 'works' });
      User.hasMany(models.Task, { foreignKey: 'assigneeId', sourceKey: 'id', as: 'tasks' });
      User.hasMany(models.Comment, { foreignKey: 'creatorId', sourceKey: 'id', as: 'comments' });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      description: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      birthday: DataTypes.DATE,
      isActive: DataTypes.BOOLEAN,
      avatar: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'User',
      paranoid: true,
      deletedAt: 'deletedAt',
    },
  );
  return User;
};
