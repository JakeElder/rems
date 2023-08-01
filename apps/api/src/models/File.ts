import { DataTypes, Model, ModelAttributes, Sequelize } from "sequelize";

class File extends Model {}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING(255),
  alternativeText: DataTypes.STRING(255),
  caption: DataTypes.STRING(255),
  width: DataTypes.INTEGER,
  height: DataTypes.INTEGER,
  formats: DataTypes.JSONB,
  hash: DataTypes.STRING(255),
  ext: DataTypes.STRING(255),
  mime: DataTypes.STRING(255),
  size: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  url: DataTypes.STRING(255),
  previewUrl: DataTypes.STRING(255),
  provider: DataTypes.STRING(255),
  providerMetadata: DataTypes.JSONB,
  folderPath: DataTypes.STRING(255)
};

export default (sequelize: Sequelize) =>
  File.init(attributes, { sequelize, underscored: true });
