import { DataTypes, Sequelize } from "sequelize";
import * as pg from "pg";

import property from "./Property";
import file from "./File";
import fileRelatedMorph from "./FileRelatedMorph";
import snakeCase from "snake-case";
import camelCase from "camelcase";

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialectModule: pg,
  dialectOptions: {
    ssl: process.env.DATABASE_SSL
      ? { require: true, rejectUnauthorized: false }
      : null
  },
  logging: false
});

const filter = (model: string, link: string) => {
  const Model = sequelize.define(
    model,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    { underscored: true }
  );

  const Link = sequelize.define(
    link,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      property_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "properties",
          key: "id"
        },
        onDelete: "CASCADE"
      },

      [`${snakeCase(model)}_id`]: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: `${snakeCase(model)}s`,
          key: "id"
        },
        onDelete: "CASCADE"
      },
      property_order: {
        type: DataTypes.FLOAT,
        allowNull: true
      }
    },
    { underscored: true, timestamps: false }
  );

  Property.belongsToMany(Model, { through: Link, as: `${camelCase(model)}s` });
  Model.belongsToMany(Property, { through: Link });

  Link.belongsTo(Model);
  Model.hasMany(Link);

  return [Model, Link];
};

const Property = property(sequelize);
const File = file(sequelize);
const FileRelatedMorph = fileRelatedMorph(sequelize);

const [PropertyType, PropertiesPropertyTypeLink] = filter(
  "PropertyType",
  "PropertiesPropertyTypeLink"
);
const [ViewType, PropertiesViewTypesLink] = filter(
  "ViewType",
  "PropertiesViewTypesLink"
);
const [IndoorFeature, PropertiesIndoorFeaturesLink] = filter(
  "IndoorFeature",
  "PropertiesIndoorFeaturesLink"
);
const [OutdoorFeature, PropertiesOutdoorFeaturesLink] = filter(
  "OutdoorFeature",
  "PropertiesOutdoorFeaturesLink"
);
const [LotFeature, PropertiesLotFeaturesLink] = filter(
  "LotFeature",
  "PropertiesLotFeaturesLink"
);

File.belongsToMany(Property, {
  through: {
    model: FileRelatedMorph,
    unique: false,
    scope: {
      relatedType: "api::property.property",
      field: "images"
    }
  },
  foreignKey: "fileId",
  otherKey: "related_id",
  as: "properties"
});

Property.belongsToMany(File, {
  through: {
    model: FileRelatedMorph,
    unique: false,
    scope: {
      relatedType: "api::property.property",
      field: "images"
    }
  },
  foreignKey: "relatedId",
  otherKey: "file_id",
  constraints: false,
  as: "images"
});

File.hasMany(FileRelatedMorph, { foreignKey: "file_id" });
FileRelatedMorph.belongsTo(File, { foreignKey: "file_id" });

export {
  sequelize,
  Property,
  File,
  FileRelatedMorph,
  ViewType,
  PropertyType,
  IndoorFeature,
  OutdoorFeature,
  LotFeature,
  PropertiesIndoorFeaturesLink,
  PropertiesPropertyTypeLink,
  PropertiesViewTypesLink,
  PropertiesLotFeaturesLink,
  PropertiesOutdoorFeaturesLink
};
