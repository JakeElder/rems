import { Filter } from "@rems/types";

export const idsToSlugs = (filters: Filter[], ids: Filter["id"][]) =>
  ids.map((id) => filters.find((f) => f.id === id)!.slug);

export const slugsToIds = (filters: Filter[], slugs: Filter["slug"][]) =>
  slugs.map((slug) => filters.find((f) => f.slug === slug)!.id);
