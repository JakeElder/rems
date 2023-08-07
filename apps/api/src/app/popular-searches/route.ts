import * as Models from "@/models";
import { FilterSetSchema } from "@rems/schemas";
import { NextResponse } from "next/server";
import { Image } from "@rems/types";

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

  const processImage = (i: any): Image => {
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
  };

  const filterSets = searches.PopularSearchesFilterSetsLinks.map((p: any) => {
    const { image, ...json } = p.FilterSet.toJSON();
    return FilterSetSchema.parse({ ...json, image: processImage(image[0]) });
  });

  console.log(filterSets);

  return NextResponse.json(filterSets);
}
