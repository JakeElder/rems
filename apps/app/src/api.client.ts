import { RealEstateQuery } from "@rems/types";

export async function resolveNl(query: string): Promise<RealEstateQuery> {
  const res = await fetch(`/api/ai-search?query=${encodeURIComponent(query)}`);
  return res.json();
}
