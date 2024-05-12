'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, { foreignKey: 'creatorId', targetKey: 'id', as: 'creator' });
      Comment.belongsTo(models.Task, { foreignKey: 'taskId', targetKey: 'id', as: 'task' });
    }
  }
  Comment.init(
    {
      creatorId: DataTypes.INTEGER,
      content: DataTypes.STRING,
      taskId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Comment',
      paranoid: true,
      deletedAt: 'deletedAt',
    },
  );
  return Comment;
};
