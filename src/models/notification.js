'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.User, { foreignKey: 'receiverId', targetKey: 'id', as: 'receiver' });
      Notification.belongsTo(models.User, { foreignKey: 'senderId', targetKey: 'id', as: 'sender' });
      Notification.belongsTo(models.Workspace, { foreignKey: 'workspaceId', targetKey: 'id', as: 'workspace' });
    }
  }
  Notification.init(
    {
      content: DataTypes.STRING,
      link: DataTypes.STRING,
      type: DataTypes.STRING,
      read: DataTypes.BOOLEAN,
      receiverId: DataTypes.INTEGER,
      senderId: DataTypes.INTEGER,
      workspaceId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Notification',
      paranoid: true,
      deletedAt: 'deletedAt',
    },
  );
  return Notification;
};
