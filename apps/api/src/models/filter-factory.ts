import { DataTypes, Sequelize } from "sequelize";
import { snakeCase } from "snake-case";
import camelCase from "camelcase";
import property from "./Property";

export default (
  sequelize: Sequelize,
  Property: ReturnType<typeof property>
) => {
  return (model: string, link: string) => {
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

    Property.belongsToMany(Model, {
      through: Link,
      as: `${camelCase(model)}s`
    });
    Model.belongsToMany(Property, { through: Link });

    Link.belongsTo(Model);
    Model.hasMany(Link);

    return [Model, Link];
  };
};
