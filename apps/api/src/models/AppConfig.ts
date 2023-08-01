import { DataTypes, Model, ModelAttributes, Sequelize } from "sequelize";

class AppConfig extends Model {}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  defaultTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  defaultDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notificationEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lineUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  instagramUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  linkedInUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  facebookUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
};

export default (sequelize: Sequelize) =>
  AppConfig.init(attributes, {
    sequelize,
    tableName: "app_config_options",
    underscored: true,
    timestamps: false
  });
