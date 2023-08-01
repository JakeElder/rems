import property from "./Property";
import file from "./File";
import fileRelatedMorph from "./FileRelatedMorph";
import appConfig from "./AppConfig";
import filterSet from "./FilterSet";
import popularSearch from "./PopularSearch";
import popularSearchesFilterSetsLink from "./PopularSearchesFilterSetsLink";
import quickFiltersComponent from "./QuickFiltersComponent";
import sequelize from "./sequelize";
import filterFactory from "./filter-factory";
import relateImagesFactory from "./relate-images-factory";
import componentFilterLinkFactory from "./component-filter-link-factory";
import featuredPropertyListsPropertiesLink from "./FeaturedPropertyListsPropertiesLink";

const Property = property(sequelize);
const File = file(sequelize);
const FileRelatedMorph = fileRelatedMorph(sequelize);
const AppConfig = appConfig(sequelize);
const FilterSet = filterSet(sequelize);
const PopularSearch = popularSearch(sequelize);
const PopularSearchesFilterSetsLink = popularSearchesFilterSetsLink(sequelize);
const FeaturedPropertyListsPropertiesLink =
  featuredPropertyListsPropertiesLink(sequelize);
const QuickFiltersComponent = quickFiltersComponent(sequelize);

const componentFilterLink = componentFilterLinkFactory(sequelize);
const filter = filterFactory(sequelize, Property);
const relateImages = relateImagesFactory(File, FileRelatedMorph);

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
const [MrtStation, PropertiesNearestMrtStationLink] = filter(
  "MrtStation",
  "PropertiesNearestMRTStationLink"
);
const [BtsStation, PropertiesNearestBtsStationLink] = filter(
  "BtsStation",
  "PropertiesNearestBtsStationLink"
);
const [Area, PropertiesAreaLink] = filter("Area", "PropertiesAreaLink");

const ComponentsQuickFiltersIndoorFeaturesFilterLink = componentFilterLink(
  "ComponentsQuickFiltersIndoorFeaturesFilterLink",
  IndoorFeature
);

const ComponentsQuickFiltersOutdoorFeaturesFilterLink = componentFilterLink(
  "ComponentsQuickFiltersOutdoorFeaturesFilterLink",
  OutdoorFeature
);

const ComponentsQuickFiltersViewTypesFilterLink = componentFilterLink(
  "ComponentsQuickFiltersViewTypesFilterLink",
  ViewType
);

const ComponentsQuickFiltersLotFeaturesFilterLink = componentFilterLink(
  "ComponentsQuickFiltersLotFeaturesFilterLink",
  LotFeature
);

File.hasMany(FileRelatedMorph, { foreignKey: "file_id" });
FileRelatedMorph.belongsTo(File, { foreignKey: "file_id" });

relateImages({
  Model: Property,
  relatedType: "api::property.property",
  as: "properties",
  field: "images"
});

relateImages({
  Model: FilterSet,
  relatedType: "api::filter-set.filter-set",
  as: "filterSets",
  field: "image"
});

PopularSearch.hasMany(PopularSearchesFilterSetsLink, {
  foreignKey: "popular_searches_list_id",
  onDelete: "CASCADE"
});

FilterSet.hasMany(PopularSearchesFilterSetsLink, {
  foreignKey: "filter_set_id",
  onDelete: "CASCADE"
});

PopularSearchesFilterSetsLink.belongsTo(PopularSearch, {
  foreignKey: "popular_searches_list_id",
  onDelete: "CASCADE"
});

PopularSearchesFilterSetsLink.belongsTo(FilterSet, {
  foreignKey: "filter_set_id",
  onDelete: "CASCADE"
});

FeaturedPropertyListsPropertiesLink.belongsTo(Property, {
  foreignKey: "property_id"
});

Property.hasOne(FeaturedPropertyListsPropertiesLink, {
  foreignKey: "property_id"
});

export {
  sequelize,
  AppConfig,
  Area,
  File,
  FileRelatedMorph,
  FilterSet,
  IndoorFeature,
  LotFeature,
  OutdoorFeature,
  MrtStation,
  BtsStation,
  PropertiesAreaLink,
  PropertiesIndoorFeaturesLink,
  PropertiesLotFeaturesLink,
  PropertiesOutdoorFeaturesLink,
  PropertiesPropertyTypeLink,
  PropertiesViewTypesLink,
  PropertiesNearestMrtStationLink,
  PropertiesNearestBtsStationLink,
  Property,
  PropertyType,
  ViewType,
  PopularSearch,
  PopularSearchesFilterSetsLink,
  QuickFiltersComponent,
  ComponentsQuickFiltersIndoorFeaturesFilterLink,
  ComponentsQuickFiltersViewTypesFilterLink,
  ComponentsQuickFiltersOutdoorFeaturesFilterLink,
  ComponentsQuickFiltersLotFeaturesFilterLink,
  FeaturedPropertyListsPropertiesLink
};
