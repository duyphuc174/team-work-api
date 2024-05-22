'use strict';
const { Model } = require('sequelize');
const User = require('./user');
module.exports = (sequelize, DataTypes) => {
  class Workspace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Workspace.belongsTo(models.User, { foreignKey: 'creatorId', targetKey: 'id', as: 'creator' });
      Workspace.hasMany(models.Member, { foreignKey: 'workspaceId', sourceKey: 'id', as: 'members' });
      Workspace.hasMany(models.Notification, { foreignKey: 'workspaceId', sourceKey: 'id', as: 'notifications' });
    }
  }
  Workspace.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      creatorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Workspace',
      paranoid: true,
      deletedAt: 'deletedAt',
    },
  );

  return Workspace;
};
