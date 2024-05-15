'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.User, { foreignKey: 'assigneeId', targetKey: 'id', as: 'assignee' });
      Task.belongsTo(models.Work, { foreignKey: 'workId', targetKey: 'id', as: 'work' });
      Task.hasMany(models.Comment, { foreignKey: 'taskId', sourceKey: 'id', as: 'comments' });
    }
  }
  Task.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      deadline: DataTypes.DATE,
      assigneeId: DataTypes.INTEGER,
      important: DataTypes.INTEGER,
      completed: DataTypes.BOOLEAN,
      workId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Task',
      paranoid: true,
      deletedAt: 'deletedAt',
    },
  );
  return Task;
};
