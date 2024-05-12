'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Important extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Important.belongsTo(models.Work, { foreignKey: 'importantId', targetKey: 'id', as: 'work' });
    }
  }
  Important.init(
    {
      level: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Important',
      paranoid: true,
      deletedAt: 'deletedAt',
    },
  );
  return Important;
};
