import { PluginUploadFile } from "./generated/contentTypes";
import { ZodRawShape, z } from "zod";

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type ResourceId = string;

type CMSAttributes = {
  createdAt: string;
  updatedAt: string;
};

export type Image = Partial<
  Omit<PluginUploadFile["attributes"], "width" | "height">
> & {
  id: ResourceId;
  width: number;
  height: number;
  src: string;
  formats?: any;
};

export type CarouselImage = Image & {
  alt: string;
};

const filterSchemaFactory = () =>
  z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string()
  });

export const filterSchema = filterSchemaFactory();

export const propertySchema = z
  .object({
    id: z.number().describe(`A automatically generated unique identifier`),
    uid: z.string().describe(
      `A unique identifier, entered by the real estate agent. Used so that
      the estate agent can correlate the property with their internal record`
    ),
    title: z.string().describe(
      `An SEO friendly description of the property. It should be evocative,
      attractive to potential buyers. It should be succint`
    ),
    description: z.string().describe(
      `A long(ish) form description of the property. It should be easy to read and
      well structured. It should contain key details about the property and be
      between 3 and 7 paragraphs long.`
    ),
    purchasePrice: z.number().describe(
      `The price, set by the owner that someone may purchase the property
      for, if for sale. Every property must have either a purchasePrice,
      rentalPrice or both. The price is specified in Thai Baht`
    ),
    rentalPrice: z.number().describe(
      `The price, set by the owner that someone may rent the property
      for, if available for rent. Every property must have either a purchasePrice,
      rentalPrice or both. The price is specified in Thai Baht`
    ),
    bedrooms: z.number().describe(`The number of bathrooms in the property`),
    bathrooms: z.number().describe(`The number of bathrooms in the property`),
    livingArea: z
      .number()
      .describe(`The living area of the property, specified in m²`),
    location: z.object({
      lng: z.number().describe(`The longitude of the properties location`),
      lat: z.number().describe(`The latitude of the properties location`)
    }),
    indoorFeatures: z.array(filterSchemaFactory()).describe(
      `A list of indoor features that may be attractive to the end user,
      people seeking rental or purchase properties`
    ),
    lotFeatures: z.array(filterSchemaFactory()).describe(
      `A list of lot features, IE features of the condo building or
      project that contains the property`
    ),
    outdoorFeatures: z.array(filterSchemaFactory()).describe(
      `A list of outdoor features, IE features of the condo building or
      project that contains the property`
    ),
    viewTypes: z
      .array(filterSchemaFactory())
      .describe(`A list of view types that the property has`),
    address: z.string(),
    area: filterSchemaFactory().describe(`The area the property is in.`)
  })
  .partial({
    purchasePrice: true,
    rentalPrice: true
  })
  .describe(
    `A schema that encapsulates all of the information of a single property`
  );

export type Property = {
  id: number;
  uid: string;
  title: string;
  description: string;
  url: string;
  purchasePrice?: number;
  formattedPurchasePrice: string | null;
  rentalPrice?: number;
  formattedRentalPrice: string | null;
  bedrooms: number;
  bathrooms: number;
  livingArea: number;
  images: Image[];
  location: null | {
    lng: number;
    lat: number;
  };
  indoorFeatures: IndoorFeature[];
  lotFeatures: LotFeature[];
  outdoorFeatures: OutdoorFeature[];
  viewTypes: ViewType[];
  address: string;
  publishedAt: string;
} & CMSAttributes;

export type EntryCard = {
  title: string;
  caption: string;
  url: string;
  image: Image;
};

export type Filter = {
  id: number;
  name: string;
  slug: string;
} & CMSAttributes;

export type Area = Filter;
export type BTSStation = Filter;
export type IndoorFeature = Filter;
export type LotFeature = Filter;
export type MRTStation = Filter;
export type OutdoorFeature = Filter;
export type PropertyType = Filter;
export type ViewType = Filter;

export type LivingAreaSize = {
  value: number;
  label: string;
};

export type LotSize = {
  value: number;
  label: string;
};

export type QuickFilter = {
  key: QuickFilterQueryKey;
  filter: Filter;
};

export type Filters = {
  btsStations: BTSStation[];
  indoorFeatures: IndoorFeature[];
  lotFeatures: LotFeature[];
  mrtStations: MRTStation[];
  areas: Area[];
  outdoorFeatures: OutdoorFeature[];
  propertyTypes: PropertyType[];
  viewTypes: ViewType[];
  livingAreaSizes: {
    min: LivingAreaSize[];
    max: LivingAreaSize[];
  };
  lotSizes: {
    min: LotSize[];
    max: LotSize[];
  };
  priceRange: {
    minRentalPrice: number;
    maxRentalPrice: number;
    minPurchasePrice: number;
    maxPurchasePrice: number;
  };
  quickFilters: QuickFilter[];
};

export const contactFormDataSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    uid: z.string().default(""),
    message: z.string().default(""),
    phone: z.string().default("")
  })
  .partial()
  .required({ name: true, email: true });

export type ContactFormData = z.infer<typeof contactFormDataSchema>;

export const realEstateQuerySchema = z.object({
  "indoor-features": z.string().array().default([]).catch([]),
  "lot-features": z.string().array().default([]).catch([]),
  "outdoor-features": z.string().array().default([]).catch([]),
  "property-type": z.string().array().default([]).catch([]),
  "view-types": z.string().array().default([]).catch([]),
  page: z.coerce.number().default(1).catch(1),
  sort: z
    .enum([
      "newest-first",
      "lowest-price-first",
      "highest-price-first",
      "smallest-living-area-first",
      "largest-living-area-first"
    ])
    .default("newest-first")
    .catch("newest-first"),
  "min-price": z.coerce.number().default(0).catch(0),
  "max-price": z.coerce.number().nullable().default(null).catch(null),
  "min-bedrooms": z.coerce.number().default(0).catch(0),
  "max-bedrooms": z.coerce.number().nullable().default(null).catch(null),
  "min-bathrooms": z.coerce.number().default(0).catch(0),
  "min-living-area": z.coerce.number().default(0).catch(0),
  "max-living-area": z.coerce.number().nullable().default(null).catch(null),
  "nearest-mrt-station": z.string().nullable().default(null).catch(null),
  "nearest-bts-station": z.string().nullable().default(null).catch(null),
  area: z.string().nullable().default(null).catch(null),
  availability: z.enum(["sale", "rent"]).default("sale").catch("sale"),
  "min-lot-size": z.coerce.number().default(0).catch(0),
  "max-lot-size": z.coerce.number().nullable().default(null).catch(null)
});

export type RealEstateQuery = z.infer<typeof realEstateQuerySchema>;

const partialRealEstateQuery = realEstateQuerySchema.partial();
export type PartialRealEstateQuery = z.infer<typeof partialRealEstateQuery>;

export type QuickFilterQueryKey = keyof Pick<
  RealEstateQuery,
  "indoor-features" | "outdoor-features" | "lot-features" | "view-types"
>;

export type SortType = RealEstateQuery["sort"];

export type GetPropertiesResult = {
  query: RealEstateQuery;
  data: Property[];
  pagination: Pagination;
};

export type FilterSet = {
  id: number;
  name: string;
  slug: string;
  image: Image;
};

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export type AppConfig = {
  defaultTitle: string;
  defaultDescription: string;
  notificationEmail: string;
  lineURL?: string;
  instagramURL?: string;
  linkedInURL?: string;
  facebookURL?: string;
};

type BaseQueryStateEntry = {
  hash: string;
  queryString: string;
  nl: string;
};

export type InteractionQueryState = {
  origin: "interaction";
  loading: boolean;
} & BaseQueryStateEntry;

export type NlQueryState = {
  origin: "nl";
} & BaseQueryStateEntry;

export type QueryStateHistoryEntry = InteractionQueryState | NlQueryState;

export type QueryStateHistory = QueryStateHistoryEntry[];

export type AiSearchInputState =
  | "inactive"
  | "inputting"
  | "listening"
  | "resolving"
  | "resolved"
  | "committed";
