import { PropertySchema } from "@rems/schemas";
import * as Models from "@/models";
import { NextResponse } from "next/server";
import slugify from "slugify";

type Params = {
  params: { id: string };
};

export async function GET(_req: Request, { params }: Params) {
  const res = await Models.Property.findOne({
    where: { id: params.id },
    raw: true
  });

  if (!res) {
    return new Response(null, { status: 404 });
  }

  const raw: any = res;

  const format = (val: number | null) =>
    val ? `฿${val.toLocaleString()}` : null;

  const slug = slugify(raw.title, { strict: true });
  const property = PropertySchema.parse({
    ...res,
    url: `/real-estate/${slug}-${raw.id}`,
    formattedPurchasePrice: format(raw.purchasePrice),
    formattedRentalPrice: format(raw.rentalPrice)
  });

  // ...parsed,
  // url: `/real-estate/${slug}-${parsed.id}`,
  //   formattedPurchasePrice: format(parsed.purchasePrice),
  //     formattedRentalPrice: format(parsed.rentalPrice)
  // };

  return NextResponse.json(property);
}
