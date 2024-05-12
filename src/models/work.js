'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Work extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Work.belongsTo(models.Sprint, { foreignKey: 'sprintId', targetKey: 'id', as: 'sprint' });
      Work.belongsTo(models.Important, { foreignKey: 'importantId', targetKey: 'id', as: 'important' });
      Work.belongsTo(models.User, { foreignKey: 'followerId', targetKey: 'id', as: 'follower' });
      Work.hasMany(models.Task, { foreignKey: 'workId', sourceKey: 'id', as: 'tasks' });
    }
  }
  Work.init(
    {
      title: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      status: DataTypes.STRING,
      description: DataTypes.STRING,
      sprintId: DataTypes.INTEGER,
      importantId: DataTypes.INTEGER,
      followerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Work',
      paranoid: true,
      deletedAt: 'deletedAt',
    },
  );
  return Work;
};
