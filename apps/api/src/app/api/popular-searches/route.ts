import * as Models from "@/models";
import { FilterSetSchema } from "@rems/schemas";
import { NextResponse } from "next/server";

export async function GET() {
  const searches: any = await Models.PopularSearch.findOne({
    include: [
      {
        model: Models.PopularSearchesFilterSetsLink,
        include: [
          {
            model: Models.FilterSet,
            include: [{ model: Models.File, as: "image" }]
          }
        ]
      }
    ]
  });

  const filterSets = searches.PopularSearchesFilterSetsLinks.map((p: any) => {
    const { image, ...json } = p.FilterSet.toJSON();
    return FilterSetSchema.parse({
      ...json,
      image: {
        ...image[0],
        url: `${process.env.ASSET_URL}${image[0].url}`
      }
    });
  });

  return NextResponse.json(filterSets);
}
