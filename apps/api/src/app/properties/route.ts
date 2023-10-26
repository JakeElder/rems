import { NextRequest, NextResponse } from "next/server";
import qs from "qs";
import {
  FilterSchema,
  RealEstateQuerySchema,
  UrlRealEstateQuerySchema
} from "@rems/schemas";
import resolve from "./resolve";
import { fromSearchParams } from "@rems/utils/query";
import * as Models from "@/models";

const parse = (rows: any) => rows.map((r: any) => FilterSchema.parse(r));

export async function GET(req: NextRequest) {
  const [
    indoorFeatures,
    lotFeatures,
    outdoorFeatures,
    viewTypes,
    propertyTypes
  ] = await Promise.all([
    Models.IndoorFeature.findAll({ raw: true }).then(parse),
    Models.LotFeature.findAll({ raw: true }).then(parse),
    Models.OutdoorFeature.findAll({ raw: true }).then(parse),
    Models.ViewType.findAll({ raw: true }).then(parse),
    Models.PropertyType.findAll({ raw: true }).then(parse)
  ]);

  const query = fromSearchParams(Object.fromEntries(req.nextUrl.searchParams), {
    indoorFeatures,
    lotFeatures,
    outdoorFeatures,
    viewTypes,
    propertyTypes
  });

  const properties = await resolve(query);

  return NextResponse.json(properties);
}
