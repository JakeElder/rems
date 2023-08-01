import { RealEstateQuerySchema } from "@rems/schemas";
import {
  PartialRealEstateQuery,
  Property,
  Image,
  IndoorFeature,
  LotFeature,
  OutdoorFeature,
  ViewType,
  RealEstateQuery,
  GetPropertiesResult,
  AppConfig
} from "@rems/types";
import qs from "query-string";
import { omitBy, equals } from "remeda";

type Route<Route extends string, ReturnType, Args extends any[] = []> = {
  route: Route;
  returns: ReturnType;
  args: Args;
};

type Routes =
  | Route<"app-config", AppConfig>
  | Route<"property", Property, [Property["id"]]>
  | Route<"properties", GetPropertiesResult, [query?: PartialRealEstateQuery]>
  | Route<"properties/[id]/images", Image[], [propertyId?: Property["id"]]>
  | Route<
      "properties/[id]/indoor-features",
      IndoorFeature[],
      [propertyId?: Property["id"]]
    >
  | Route<
      "properties/[id]/outdoor-features",
      OutdoorFeature[],
      [propertyId?: Property["id"]]
    >
  | Route<
      "properties/[id]/view-types",
      ViewType[],
      [propertyId?: Property["id"]]
    >
  | Route<
      "properties/[id]/lot-features",
      LotFeature[],
      [propertyId?: Property["id"]]
    >;

type RouteArgs<T> = Extract<Routes, { route: T }>["args"];
type RouteReturns<T> = Extract<Routes, { route: T }>["returns"];

let URL: null | string = null;

export const init = (url: string) => {
  URL = url;
};

const url = (endpoint: string) => `${URL}/${endpoint}`;

const propertyResource = async (
  propertyId: Property["id"],
  resource: string
) => {
  const res = await fetch(url(`properties/${propertyId}/${resource}`));
  return res.json();
};

export const removeDefaults = (
  query: PartialRealEstateQuery
): PartialRealEstateQuery => {
  const defaults = RealEstateQuerySchema.parse({});
  return omitBy(query, (v, k) => equals(defaults[k], v));
};

export const generateQueryString = (
  query: PartialRealEstateQuery,
  page?: number,
  sort?: RealEstateQuery["sort"]
) => {
  const string = qs.stringify(
    removeDefaults({
      ...query,
      ...(page ? { page } : {}),
      ...(sort ? { sort } : {})
    }),
    { arrayFormat: "bracket" }
  );
  return string ? `?${string}` : "";
};

const wrapper = async <T extends Routes["route"]>(
  route: T,
  ...args: RouteArgs<T>
): Promise<RouteReturns<T>> => {
  if (!URL) {
    throw new Error();
  }

  if (route === "app-config") {
    const res = await fetch(url(`app-config`));
    return res.json();
  }

  if (route === "properties") {
    const params = (args[0] || {}) as PartialRealEstateQuery;
    const res = await fetch(url(`properties${generateQueryString(params)}`));
    return res.json();
  }

  if (route === "property") {
    const [id] = args;
    const res = await fetch(url(`properties/${id}`));
    return res.json();
  }

  if (route === "properties/[id]/images") {
    return propertyResource(args[0] as Property["id"], "images");
  }

  if (route === "properties/[id]/indoor-features") {
    return propertyResource(args[0] as Property["id"], "indoor-features");
  }

  if (route === "properties/[id]/lot-features") {
    return propertyResource(args[0] as Property["id"], "lot-features");
  }

  if (route === "properties/[id]/outdoor-features") {
    return propertyResource(args[0] as Property["id"], "outdoor-features");
  }

  if (route === "properties/[id]/view-types") {
    return propertyResource(args[0] as Property["id"], "view-types");
  }

  throw new Error(`Route ${route} invalid`);
};

export default wrapper;
