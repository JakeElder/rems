import { DataTypes, Model, ModelAttributes, Sequelize } from "sequelize";

class FilterSet extends Model {}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING
  },
  slug: {
    type: DataTypes.STRING
  }
};

export default (sequelize: Sequelize) =>
  FilterSet.init(attributes, { sequelize, underscored: true });
