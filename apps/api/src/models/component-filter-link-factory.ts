import { DataTypes, Sequelize } from "sequelize";
import camelCase from "camelcase";
import property from "./Property";

export default (sequelize: Sequelize) => {
  return (model: string, Filter: ReturnType<typeof property>) => {
    const Link = sequelize.define(
      model,
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        [`${camelCase(Filter.name)}Id`]: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        [`inv${Filter.name}Id`]: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
      },
      { underscored: true, timestamps: false }
    );

    Link.belongsTo(Filter, { foreignKey: `inv${Filter.name}Id` });

    return Link;
  };
};
