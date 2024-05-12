'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Member.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
      Member.belongsTo(models.Workspace, { foreignKey: 'workspaceId', targetKey: 'id', as: 'workspace' });
    }
  }
  Member.init(
    {
      userId: DataTypes.INTEGER,
      role: DataTypes.STRING,
      workspaceId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Member',
      paranoid: true,
      deletedAt: 'deletedAt',
    },
  );
  return Member;
};
