import { Property } from "@rems/types";

export default async function getProperties(
  query: string
): Promise<Property[]> {
  const res = await fetch(`/api/properties${query}`);
  const json = await res.json();
  return json.data;
}
