import { NextRequest, NextResponse } from "next/server";
import { FilterSchema } from "@rems/schemas";
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

  const { target, ...rest } = Object.fromEntries(req.nextUrl.searchParams);

  if (target !== "LISTINGS" && target !== "MAP") {
    throw new Error();
  }

  const query = fromSearchParams(rest, {
    indoorFeatures,
    lotFeatures,
    outdoorFeatures,
    viewTypes,
    propertyTypes
  });

  const properties = await resolve({ ...query, target });

  return NextResponse.json(properties);
}
