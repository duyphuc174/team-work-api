'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskFileStorage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TaskFileStorage.belongsTo(models.Task, { foreignKey: 'taskId', targetKey: 'id', as: 'task' });
    }
  }
  TaskFileStorage.init(
    {
      link: DataTypes.STRING,
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      taskId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'TaskFileStorage',
      paranoid: true,
      deletedAt: 'deletedAt',
    },
  );
  return TaskFileStorage;
};
