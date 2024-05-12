'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sprint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sprint.belongsTo(models.Workspace, { foreignKey: 'workspaceId', targetKey: 'id', as: 'workspace' });
      Sprint.belongsTo(models.User, { foreignKey: 'creatorId', targetKey: 'id', as: 'creator' });
    }
  }
  Sprint.init(
    {
      name: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      workspaceId: DataTypes.INTEGER,
      creatorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Sprint',
      paranoid: true,
      deletedAt: 'deletedAt',
    },
  );
  return Sprint;
};
