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
    }
  }
  Notification.init(
    {
      content: DataTypes.STRING,
      receiverId: DataTypes.INTEGER,
      link: DataTypes.STRING,
      type: DataTypes.STRING,
      read: DataTypes.BOOLEAN,
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
