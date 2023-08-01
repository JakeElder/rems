import { DataTypes, Model, ModelAttributes, Sequelize } from "sequelize";

class FileRelatedMorph extends Model {}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  fileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "file",
      key: "id"
    },
    onDelete: "CASCADE"
  },
  relatedId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  relatedType: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  field: DataTypes.STRING(255),
  order: DataTypes.FLOAT
};

export default (sequelize: Sequelize) =>
  FileRelatedMorph.init(attributes, {
    sequelize,
    underscored: true,
    tableName: "files_related_morphs",
    timestamps: false
  });
