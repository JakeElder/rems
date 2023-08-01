import { DataTypes, Model, ModelAttributes, Sequelize } from "sequelize";

class QuickFiltersComponent extends Model {}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  componentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  componentType: {
    type: DataTypes.STRING(255)
  },
  field: {
    type: DataTypes.STRING(255)
  },
  order: {
    type: DataTypes.FLOAT
  }
};

export default (sequelize: Sequelize) =>
  QuickFiltersComponent.init(attributes, {
    sequelize,
    underscored: true,
    timestamps: false
  });
