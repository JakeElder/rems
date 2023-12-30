import {
  GetPropertiesResult,
  Image,
  ApiRealEstateQuery as Query,
  Location,
  Filter
} from "@rems/types";
import {
  File,
  FileRelatedMorph,
  Property,
  PropertyType,
  sequelize
} from "@/models";
import { Op, literal } from "sequelize";
import { ImageSchema, PropertySchema } from "@rems/schemas";
import slugify from "slugify";
import resolveLocationSource from "../../utils/resolve-location-source";

const PROPERTIES_PER_PAGE = 14;

const propertyType = (query: Query) => {
  return query.propertyTypes.length
    ? [
        {
          model: PropertyType,
          as: "propertyTypes",
          where: {
            id: { [Op.in]: query.propertyTypes.map((f) => f.id) }
          }
        }
      ]
    : [];
};

const purchasePrice = (query: Query) => {
  return query.budgetAndAvailability.type === "SALE"
    ? [
        {
          purchasePrice: {
            [Op.gte]: query.budgetAndAvailability.minPrice,
            ...(query.budgetAndAvailability.maxPrice
              ? { [Op.lte]: query.budgetAndAvailability.maxPrice }
              : {})
          }
        }
      ]
    : [];
};

const rentalPrice = (query: Query) => {
  const { type, minPrice, maxPrice } = query.budgetAndAvailability;
  return type === "RENT"
    ? [
        {
          rentalPrice: {
            [Op.gte]: minPrice,
            ...(maxPrice ? { [Op.lte]: maxPrice } : {})
          }
        }
      ]
    : [];
};

const bedrooms = (query: Query) => {
  const { minBedrooms, maxBedrooms } = query.space;
  return [
    {
      bedrooms: {
        [Op.gte]: minBedrooms,
        ...(maxBedrooms ? { [Op.lte]: maxBedrooms } : {})
      }
    }
  ];
};

const bathrooms = (query: Query) => {
  const { minBathrooms } = query.space;
  return [{ bathrooms: { [Op.gte]: minBathrooms } }];
};

const livingArea = (query: Query) => {
  const { minLivingArea, maxLivingArea } = query.space;
  return [
    {
      livingArea: {
        [Op.gte]: minLivingArea,
        ...(maxLivingArea ? { [Op.lte]: maxLivingArea } : {})
      }
    }
  ];
};

const lotSize = (query: Query) => {
  const { minLotSize, maxLotSize } = query.space;
  return minLotSize || maxLotSize
    ? [
        {
          lotSize: {
            [Op.gte]: minLotSize,
            ...(maxLotSize ? { [Op.lte]: maxLotSize } : {})
          }
        }
      ]
    : [];
};

const availableToRent = (query: Query) => {
  const { type } = query.budgetAndAvailability;
  return type === "RENT" ? [{ availableToRent: { [Op.eq]: true } }] : [];
};

const availableToPurchase = (query: Query) => {
  const { type } = query.budgetAndAvailability;
  return type === "SALE" ? [{ availableToPurchase: { [Op.eq]: true } }] : [];
};

const filterSubquery = (filters: Filter[], relation: string) => {
  if (filters.length === 0) {
    return [];
  }

  const ids = filters.map((f) => f.id).join(",");

  return [
    {
      id: {
        [Op.in]: sequelize.literal(`(
          SELECT "property_id"
          FROM "properties_${relation}s_links"
          INNER JOIN "${relation}s" ON "properties_${relation}s_links"."${relation}_id" = "${relation}s"."id"
          WHERE "${relation}s"."id" IN (${ids})
          GROUP BY "properties_${relation}s_links"."property_id"
          HAVING COUNT(DISTINCT "${relation}s"."slug") = ${filters.length}
        )`)
      }
    }
  ];
};

const viewTypes = (query: Query) =>
  filterSubquery(query.viewTypes, "view_type");

const indoorFeatures = (query: Query) =>
  filterSubquery(query.indoorFeatures, "indoor_feature");

const outdoorFeatures = (query: Query) =>
  filterSubquery(query.outdoorFeatures, "outdoor_feature");

const lotFeatures = (query: Query) =>
  filterSubquery(query.lotFeatures, "lot_feature");

const order = (query: Query) => {
  const { type } = query.budgetAndAvailability;

  const orders: Record<Query["pageAndSort"]["sort"], any> = {
    NEWEST_FIRST: [["createdAt", "DESC"]],
    LOWEST_PRICE_FIRST: [
      [type === "SALE" ? "purchasePrice" : "rentalPrice", "ASC"]
    ],
    HIGHEST_PRICE_FIRST: [
      [type === "SALE" ? "purchasePrice" : "rentalPrice", "DESC"]
    ],
    SMALLEST_LIVING_AREA_FIRST: [["livingArea", "ASC"]],
    LARGEST_LIVING_AREA_FIRST: [["livingArea", "DESC"]],
    CLOSEST_FIRST: [literal("distance ASC")],
    FURTHEST_FIRST: [literal("distance DESC")]
  };

  return orders[query.pageAndSort.sort];
};

const radius = (query: Query, location: Location) => {
  if (location.resolution.type === "AREA") {
    return [];
  }

  return [
    literal(`ST_DWithin(
      ST_MakePoint((location->>'lng')::double precision, (location->>'lat')::double precision)::geography,
      ST_MakePoint(${location.resolution.lng}, ${location.resolution.lat})::geography,
      ${query.locationSource.radius}
    )`)
  ];
};

const bounds = async (location: Location) => {
  if (location.resolution.type === "POINT") {
    return [];
  }

  const { bounds } = location.resolution;

  return [
    {
      "location.lat": {
        [Op.gte]: bounds.sw.lat,
        [Op.lte]: bounds.ne.lat
      },
      "location.lng": {
        [Op.gte]: bounds.sw.lng,
        [Op.lte]: bounds.ne.lng
      }
    }
  ];
};

const limit = (query: Query) => {
  if (query.target === "LISTINGS") {
    return PROPERTIES_PER_PAGE;
  }
};

const offset = (query: Query) => {
  if (query.target === "LISTINGS") {
    return (query.pageAndSort.page - 1) * PROPERTIES_PER_PAGE;
  }
};

const validLngLat = () => {
  return [
    {
      location: {
        [Op.and]: [
          { [Op.not]: null },
          { lat: { [Op.not]: null } },
          { lng: { [Op.not]: null } },
          { lat: { [Op.between]: [-90, 90] } },
          { lng: { [Op.between]: [-180, 180] } }
        ]
      }
    }
  ];
};

const queryToLocation = async (query: Query): Promise<Location> => {
  const res = await resolveLocationSource(query.locationSource);

  if (!res.ok) {
    throw new Error();
  }

  return {
    source: query.locationSource,
    resolution: res.resolution
  };
};

export default async function resolve(
  query: Query
): Promise<GetPropertiesResult> {
  const location = await queryToLocation(query);

  const res = await Property.findAndCountAll({
    where: {
      [Op.and]: [
        { publishedAt: { [Op.ne]: null } },
        ...purchasePrice(query),
        ...rentalPrice(query),
        ...bedrooms(query),
        ...bathrooms(query),
        ...livingArea(query),
        ...lotSize(query),
        ...availableToRent(query),
        ...availableToPurchase(query),
        ...viewTypes(query),
        ...indoorFeatures(query),
        ...outdoorFeatures(query),
        ...lotFeatures(query),
        ...radius(query, location),
        ...(await bounds(location)),
        ...validLngLat()
      ]
    },
    include: [...propertyType(query)],
    attributes: {
      include: [
        [
          literal(`ST_Distance(
        ST_SetSRID(ST_MakePoint((location->>'lng')::double precision, (location->>'lat')::double precision), 4326)::geography,
        ST_SetSRID(ST_MakePoint(${location.resolution.lng}, ${location.resolution.lat}), 4326)::geography
      )`),
          "distance"
        ]
      ]
    },
    limit: limit(query),
    offset: offset(query),
    order: order(query)
  });

  const images = await File.findAll({
    raw: true,
    include: [
      {
        model: FileRelatedMorph,
        where: {
          related_id: {
            [Op.in]: res.rows.map((r) => r.dataValues.id)
          },
          related_type: "api::property.property"
        }
      }
    ]
  });

  const format = (val: number | null) =>
    val ? `฿${val.toLocaleString()}` : null;

  const data = res.rows.map((row: any) => {
    const p = row.toJSON();
    const slug = slugify(p.title, { strict: true });
    return PropertySchema.parse({
      ...p,
      url: `/real-estate/${slug}-${p.id}`,
      formattedPurchasePrice: format(p.purchasePrice),
      formattedRentalPrice: format(p.rentalPrice),
      images: images
        .filter((i: any) => p.id === i["FileRelatedMorphs.related_id"])
        .map((i: any): Image => {
          if (i.provider === "local") {
            return {
              type: "local",
              props: { ...i, url: `${process.env.ASSET_URL}${i.url}` }
            };
          }

          return {
            type: "cloudinary",
            props: { ...i, id: i.providerMetadata.public_id }
          };
        })
    });
  });

  const properties = data.map((p) => {
    if (p.images!.length === 0) {
      return {
        ...p,
        images: [
          ImageSchema.parse({
            type: "cloudinary",
            props: {
              id: "https://res.cloudinary.com/dxnqopswh/image/upload/v1691021749/default_nopiyd.png",
              width: 800,
              height: 450
            }
          })
        ]
      };
    }

    return { ...p };
  });

  return {
    data: properties,
    pagination: {
      page: 1,
      pageSize: PROPERTIES_PER_PAGE,
      pageCount: res.count ? Math.ceil(res.count / PROPERTIES_PER_PAGE) : 0,
      total: res.count
    },
    location,
    query
  };
}
