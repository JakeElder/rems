import { Filter } from "@rems/types";

export const idToSlug = (filters: Filter[], id: Filter["id"]) =>
  filters.find((f) => f.id === id)!.slug;

export const slugToId = (filters: Filter[], slug: Filter["slug"]) =>
  filters.find((f) => f.slug === slug)!.id;
