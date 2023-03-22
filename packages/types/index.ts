import {
  ApiPropertyProperty,
  ApiFeaturedPropertyListFeaturedPropertyList
} from "./cms";

export type Property = {
  id: number;
  attributes: ApiPropertyProperty["attributes"];
};

export type APIResponseFeaturedPropertyList {
  data: ApiFeaturedPropertyListFeaturedPropertyList
}
