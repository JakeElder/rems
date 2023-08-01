import { DataTypes, Model, ModelAttributes, Sequelize } from "sequelize";

class PopularSearch extends Model {}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  updatedById: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
};

export default (sequelize: Sequelize) =>
  PopularSearch.init(attributes, { sequelize, underscored: true });
