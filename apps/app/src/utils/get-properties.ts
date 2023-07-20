import { GetPropertiesResult } from "@rems/types";

export default async function getProperties(
  query: string
): Promise<GetPropertiesResult> {
  const res = await fetch(`/api/properties${query}`);
  const json = await res.json();
  return json;
}
