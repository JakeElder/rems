import { DataTypes, Model, ModelAttributes, Sequelize } from "sequelize";

class PopularSearchesFilterSetsLink extends Model {}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  popular_searches_list_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "popular_searches",
      key: "id"
    },
    onDelete: "CASCADE"
  },
  filter_set_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "filter_sets",
      key: "id"
    },
    onDelete: "CASCADE"
  },
  filter_set_order: {
    type: DataTypes.FLOAT
  }
};

export default (sequelize: Sequelize) =>
  PopularSearchesFilterSetsLink.init(attributes, {
    sequelize,
    underscored: true,
    timestamps: false
  });
