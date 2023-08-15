import { RealEstateQuerySchema } from "@rems/schemas";
import {
  Property,
  Image,
  IndoorFeature,
  LotFeature,
  OutdoorFeature,
  ViewType,
  RealEstateQuery,
  GetPropertiesResult,
  AppConfig,
  FilterSet,
  QuickFilter,
  PropertyType,
  Area,
  MRTStation,
  BTSStation
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
  | Route<"popular-searches", FilterSet[]>
  | Route<"featured-properties", Property[]>
  | Route<"quick-filters", QuickFilter[]>
  | Route<"property", Property, [Property["id"]]>
  | Route<"property-types", PropertyType[]>
  | Route<"areas", Area[]>
  | Route<"view-types", ViewType[]>
  | Route<"indoor-features", IndoorFeature[]>
  | Route<"outdoor-features", OutdoorFeature[]>
  | Route<"lot-features", LotFeature[]>
  | Route<"mrt-stations", MRTStation[]>
  | Route<"bts-stations", BTSStation[]>
  | Route<"properties", GetPropertiesResult, [query?: Partial<RealEstateQuery>]>
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

const fetch: typeof global.fetch = async (input, init) => {
  const res = await global.fetch(input, {
    ...init,
    ...(process.env.VERCEL_ENV === "production" ? {} : { cache: "no-store" })
  });

  if (!res.ok) {
    throw new Error(JSON.stringify(await res.json()));
  }

  return res;
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
  query: Partial<RealEstateQuery>
): Partial<RealEstateQuery> => {
  const defaults = RealEstateQuerySchema.URL.parse({});
  return omitBy(query, (v, k) => equals(defaults[k], v));
};

export const generateQueryString = (
  query: Partial<RealEstateQuery>,
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

  if (route === "popular-searches") {
    const res = await fetch(url(`popular-searches`));
    return res.json();
  }

  if (route === "featured-properties") {
    const res = await fetch(url(`featured-properties`));
    return res.json();
  }

  // if (route === "quick-filters") {
  //   const res = await fetch(url(`quick-filters`));
  //   return res.json();
  // }

  const filters = [
    "property-types",
    "areas",
    "view-types",
    "indoor-features",
    "outdoor-features",
    "lot-features",
    "mrt-stations",
    "bts-stations"
  ];

  if (filters.includes(route)) {
    const res = await fetch(url(route));
    return res.json();
  }

  if (route === "quick-filters") {
    const res = await fetch(url(`quick-filters`));
    return res.json();
  }

  if (route === "properties") {
    const params = (args[0] || {}) as Partial<RealEstateQuery>;
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
