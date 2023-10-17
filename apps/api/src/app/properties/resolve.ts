import {
  GetPropertiesResult,
  Image,
  ServerRealEstateQuery as Query,
  Location,
  LocationSource,
  Bounds
} from "@rems/types";
import {
  File,
  FileRelatedMorph,
  Property,
  PropertyType,
  sequelize
} from "@/models";
import { Op, Sequelize } from "sequelize";
import {
  ImageSchema,
  LocationSourceSchema,
  PropertySchema
} from "@rems/schemas";
import slugify from "slugify";
import resolveLocationSource from "../../utils/resolve-location-source";

const PROPERTIES_PER_PAGE = 14;

const propertyType = (q: Query) => {
  return q["property-types"].length
    ? [
        {
          model: PropertyType,
          as: "propertyTypes",
          where: { slug: { [Op.in]: q["property-types"] } }
        }
      ]
    : [];
};

const purchasePrice = (q: Query) => {
  return q["availability"] === "sale"
    ? [
        {
          purchasePrice: {
            [Op.gte]: q["min-price"],
            ...(q["max-price"] ? { [Op.lte]: q["max-price"] } : {})
          }
        }
      ]
    : [];
};

const rentalPrice = (q: Query) => {
  return q["availability"] === "rent"
    ? [
        {
          rentalPrice: {
            [Op.gte]: q["min-price"],
            ...(q["max-price"] ? { [Op.lte]: q["max-price"] } : {})
          }
        }
      ]
    : [];
};

const bedrooms = (q: Query) => {
  return [
    {
      bedrooms: {
        [Op.gte]: q["min-bedrooms"],
        ...(q["max-bedrooms"] ? { [Op.lte]: q["max-bedrooms"] } : {})
      }
    }
  ];
};

const bathrooms = (q: Query) => {
  return [{ bathrooms: { [Op.gte]: q["min-bathrooms"] } }];
};

const livingArea = (q: Query) => {
  return [
    {
      livingArea: {
        [Op.gte]: q["min-living-area"],
        ...(q["max-living-area"] ? { [Op.lte]: q["max-living-area"] } : {})
      }
    }
  ];
};

const lotSize = (q: Query) => {
  return q["min-lot-size"] || q["max-lot-size"]
    ? [
        {
          lotSize: {
            [Op.gte]: q["min-lot-size"],
            ...(q["max-lot-size"] ? { [Op.lte]: q["max-lot-size"] } : {})
          }
        }
      ]
    : [];
};

const availableToRent = (q: Query) => {
  return q["availability"] === "rent"
    ? [{ availableToRent: { [Op.eq]: true } }]
    : [];
};

const availableToPurchase = (q: Query) => {
  return q["availability"] === "sale"
    ? [{ availableToPurchase: { [Op.eq]: true } }]
    : [];
};

const filterSubquery = (slugs: string[], relation: string) => {
  if (slugs.length === 0) {
    return [];
  }

  const escapedIn = slugs.map((s) => sequelize.escape(s)).join(",");
  return [
    {
      id: {
        [Op.in]: sequelize.literal(`(
          SELECT "property_id"
          FROM "properties_${relation}s_links"
          INNER JOIN "${relation}s" ON "properties_${relation}s_links"."${relation}_id" = "${relation}s"."id"
          WHERE "${relation}s"."slug" IN (${escapedIn})
          GROUP BY "properties_${relation}s_links"."property_id"
          HAVING COUNT(DISTINCT "${relation}s"."slug") = ${slugs.length}
        )`)
      }
    }
  ];
};

const viewTypes = (q: Query) => filterSubquery(q["view-types"], "view_type");

const indoorFeatures = (q: Query) =>
  filterSubquery(q["indoor-features"], "indoor_feature");

const outdoorFeatures = (q: Query) =>
  filterSubquery(q["outdoor-features"], "outdoor_feature");

const lotFeatures = (q: Query) =>
  filterSubquery(q["lot-features"], "lot_feature");

const order = (query: Query) => {
  const orders: Record<Query["sort"], any> = {
    "newest-first": [["createdAt", "DESC"]],
    "lowest-price-first": [
      [
        query["availability"] === "sale" ? "purchasePrice" : "rentalPrice",
        "ASC"
      ]
    ],
    "highest-price-first": [
      [
        query["availability"] === "sale" ? "purchasePrice" : "rentalPrice",
        "DESC"
      ]
    ],
    "smallest-living-area-first": [["livingArea", "ASC"]],
    "largest-living-area-first": [["livingArea", "DESC"]]
  };
  return orders[query["sort"]];
};

const radius = (query: Query) => {
  if (query["radius-enabled"] === "false") {
    return [];
  }

  return [
    Sequelize.literal(`ST_DWithin(
      ST_MakePoint((location->>'lng')::double precision, (location->>'lat')::double precision)::geography,
      ST_MakePoint(${query["origin-lng"]}, ${query["origin-lat"]})::geography,
      ${query["radius"]}
    )`)
  ];
};

const bounds = (query: Query, bounds: Bounds) => {
  if (query["radius-enabled"] === "true") {
    return [];
  }

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
  if (query["limit"] === "true") {
    return PROPERTIES_PER_PAGE;
  }
};

const offset = (query: Query) => {
  if (query["limit"] === "true") {
    return (query["page"] - 1) * PROPERTIES_PER_PAGE;
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

const queryToLocationSource = (query: Query): LocationSource => {
  const source = LocationSourceSchema.parse({
    type: query["location-source-type"] === "nl" ? "NL" : "LL",
    radius: query["radius-enabled"] === "true" ? query["radius"] : null,
    source: query["location-source"]
  });

  return source;
};

const queryToLocation = async (query: Query): Promise<Location> => {
  const source = queryToLocationSource(query);
  const res = await resolveLocationSource(source);

  if (!res.ok) {
    throw new Error();
  }

  return {
    source,
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
        ...radius(query),
        ...bounds(query, location.resolution.viewport),
        ...validLngLat()
      ]
    },
    include: [...propertyType(query)],
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
