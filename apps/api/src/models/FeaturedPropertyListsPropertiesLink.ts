import { DataTypes, Model, ModelAttributes, Sequelize } from "sequelize";

class FeaturedPropertyListsPropertiesLink extends Model {}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  featuredPropertyListId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  propertyOrder: {
    type: DataTypes.FLOAT
  }
};

export default (sequelize: Sequelize) =>
  FeaturedPropertyListsPropertiesLink.init(attributes, {
    sequelize,
    underscored: true,
    timestamps: false
  });
