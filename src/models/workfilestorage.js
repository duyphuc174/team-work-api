'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkFileStorage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WorkFileStorage.belongsTo(models.Work, { foreignKey: 'workId', targetKey: 'id', as: 'work' });
    }
  }
  WorkFileStorage.init(
    {
      link: DataTypes.STRING,
      workId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'WorkFileStorage',
      paranoid: true,
      deletedAt: 'deletedAt',
    },
  );
  return WorkFileStorage;
};
