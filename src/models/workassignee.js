'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkAssignee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WorkAssignee.belongsTo(models.Work, { foreignKey: 'workId', targetKey: 'id', as: 'work' });
      WorkAssignee.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
    }
  }
  WorkAssignee.init(
    {
      workId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'WorkAssignee',
      paranoid: true,
      deletedAt: 'deletedAt',
    },
  );
  return WorkAssignee;
};
