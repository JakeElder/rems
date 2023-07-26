import { NextResponse } from "next/server";
import qs from "qs";
import { RealEstateQuery, realEstateQuerySchema } from "@rems/types";
import {
  File,
  FileRelatedMorph,
  Property,
  PropertyType,
  sequelize
} from "../../../models";
import adapters from "../../../adapters";
import { Op } from "sequelize";

const PROPERTIES_PER_PAGE = 2;

const propertyType = (q: RealEstateQuery) => {
  return q["property-type"].length
    ? [
        {
          model: PropertyType,
          where: { slug: { [Op.in]: q["property-type"] } }
        }
      ]
    : [];
};

const purchasePrice = (q: RealEstateQuery) => {
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

const rentalPrice = (q: RealEstateQuery) => {
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

const bedrooms = (q: RealEstateQuery) => {
  return [
    {
      bedrooms: {
        [Op.gte]: q["min-bedrooms"],
        ...(q["max-bedrooms"] ? { [Op.lte]: q["max-bedrooms"] } : {})
      }
    }
  ];
};

const bathrooms = (q: RealEstateQuery) => {
  return [{ bathrooms: { [Op.gte]: q["min-bathrooms"] } }];
};

const livingArea = (q: RealEstateQuery) => {
  return [
    {
      livingArea: {
        [Op.gte]: q["min-living-area"],
        ...(q["max-living-area"] ? { [Op.lte]: q["max-living-area"] } : {})
      }
    }
  ];
};

const lotSize = (q: RealEstateQuery) => {
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

const availableToRent = (q: RealEstateQuery) => {
  return q["availability"] === "rent"
    ? [{ availableToRent: { [Op.eq]: true } }]
    : [];
};

const availableToPurchase = (q: RealEstateQuery) => {
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

const viewTypes = (q: RealEstateQuery) =>
  filterSubquery(q["view-types"], "view_type");

const indoorFeatures = (q: RealEstateQuery) =>
  filterSubquery(q["indoor-features"], "indoor_feature");

const outdoorFeatures = (q: RealEstateQuery) =>
  filterSubquery(q["outdoor-features"], "outdoor_feature");

const lotFeatures = (q: RealEstateQuery) =>
  filterSubquery(q["lot-features"], "lot_feature");

const order = (query: RealEstateQuery) => {
  const orders: Record<RealEstateQuery["sort"], any> = {
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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = qs.parse(url.search.substring(1));
  const query = realEstateQuerySchema.parse(params);

  const base = {
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
        ...lotFeatures(query)
      ]
    },
    include: [...propertyType(query)]
  };

  const res = await Property.findAndCountAll({
    ...base,
    limit: PROPERTIES_PER_PAGE,
    offset: (query["page"] - 1) * PROPERTIES_PER_PAGE,
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

  const data = res.rows.map((p) => {
    return adapters.property({
      ...p.toJSON(),
      images: images.filter(
        (i: any) => p.dataValues.id === i["FileRelatedMorphs.related_id"]
      )
    });
  });

  return NextResponse.json({
    data,
    pagination: {
      page: 1,
      pageSize: PROPERTIES_PER_PAGE,
      pageCount: res.count ? Math.ceil(res.count / PROPERTIES_PER_PAGE) : 0,
      total: res.count
    },
    query
  });
}
