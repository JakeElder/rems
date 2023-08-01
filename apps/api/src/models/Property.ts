import { DataTypes, Model, ModelAttributes, Sequelize } from "sequelize";

class Property extends Model {}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  title: DataTypes.STRING,
  purchasePrice: DataTypes.INTEGER,
  bedrooms: DataTypes.INTEGER,
  bathrooms: DataTypes.INTEGER,
  livingArea: DataTypes.INTEGER,
  location: DataTypes.JSONB,
  rentalPrice: DataTypes.INTEGER,
  availableToPurchase: DataTypes.BOOLEAN,
  availableToRent: DataTypes.BOOLEAN,
  yearBuilt: DataTypes.INTEGER,
  address: DataTypes.TEXT,
  description: DataTypes.TEXT,
  lotSize: DataTypes.INTEGER,
  uid: DataTypes.STRING(255),
  publishedAt: DataTypes.DATE,
  createdById: DataTypes.INTEGER,
  updatedById: DataTypes.INTEGER
};

export default (sequelize: Sequelize) =>
  Property.init(attributes, { sequelize, underscored: true });
