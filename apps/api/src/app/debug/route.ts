import * as Models from "@/models";
import { NextResponse } from "next/server";
import { Filter, QuickFilter } from "@rems/types";
import { getModels } from "@/remi";

const features = async () => {
  const lot = await Models.LotFeature.findAll({ raw: true });
  const outdoor = await Models.OutdoorFeature.findAll({ raw: true });
  const indoor = await Models.IndoorFeature.findAll({ raw: true });
  const viewTypes = await Models.ViewType.findAll({ raw: true });

  const toQuickFilter: (f: Filter, key: QuickFilter["key"]) => QuickFilter = (
    f,
    key
  ) => ({
    key,
    filter: { id: f.id, name: f.name, slug: f.slug }
  });

  return [
    lot.map((l: any) => toQuickFilter(l, "lot-features")),
    outdoor.map((l: any) => toQuickFilter(l, "outdoor-features")),
    indoor.map((l: any) => toQuickFilter(l, "indoor-features")),
    viewTypes.map((l: any) => toQuickFilter(l, "view-types"))
  ];
};

export async function GET() {
  const _ = await features();

  const models = await getModels();
  const ids = models.data.data.map((m: any) => m.id);
  return NextResponse.json(ids);
}
