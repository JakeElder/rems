import { PartialRealEstateQuery, RealEstateQuery } from "@rems/types";

export async function resolveNl(
  query: PartialRealEstateQuery,
  nl: string
): Promise<RealEstateQuery> {
  const res = await fetch(`/api/assistant`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, nl })
  });
  return res.json();
}
