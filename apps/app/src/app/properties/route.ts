import { NextResponse } from "next/server";
import { flatten } from "remeda";
import api from "../../api";
import qs from "query-string";
import { realEstateQuerySchema } from "@rems/types";

const processSearchParams = (params: any) => {
  return {
    ...params,
    "indoor-features": flatten([params["indoor-features[]"]]),
    "lot-features": flatten([params["lot-features[]"]]),
    "outdoor-features": flatten([params["outdoor-features[]"]]),
    "property-type": flatten([params["property-type[]"]]),
    "view-types": flatten([params["view-types[]"]])
  };
};

export async function GET(req: Request) {
  const parsed = qs.parseUrl(req.url);
  const query = realEstateQuerySchema.parse(processSearchParams(parsed.query));
  const res = await api.get.properties(query);
  return NextResponse.json(res);
}
