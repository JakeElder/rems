import { RealEstateQuerySchema } from "@rems/schemas";
import {
  AddScalarDiff,
  ArrayDiff,
  ChangeScalarDiff,
  Filter,
  RealEstateQueryArrays,
  RealEstateQueryScalars,
  RemoveScalarDiff,
  ScalarDiff
} from "@rems/types";

type ScalarKey = keyof RealEstateQueryScalars;
type ArrayKey = keyof RealEstateQueryArrays;

export const scalar = (
  query: RealEstateQueryScalars,
  patch: Partial<RealEstateQueryScalars>
): ScalarDiff[] => {
  const defaults = RealEstateQuerySchema.URL.parse({});
  const keys = Object.keys(patch) as ScalarKey[];

  const isAddition = (k: ScalarKey) =>
    query[k] === defaults[k] && patch[k] !== defaults[k];

  const isRemoval = (k: ScalarKey) =>
    patch[k] === defaults[k] && query[k] !== defaults[k];

  const isChange = (k: ScalarKey) =>
    !isAddition(k) && !isRemoval(k) && query[k] !== patch[k];

  const additions = keys
    .filter(isAddition)
    .map((k): AddScalarDiff["props"] => ({ [k]: patch[k] }));

  const removals = keys
    .filter(isRemoval)
    .map((k): RemoveScalarDiff["props"] => ({ [k]: query[k] }));

  const changes = keys
    .filter(isChange)
    .map((k): ChangeScalarDiff["props"] => ({ [k]: [query[k], patch[k]] }));

  const diffs: ScalarDiff[] = [];

  if (additions.length) {
    diffs.push({
      type: "ADD_SCALAR",
      props: Object.assign({}, ...additions)
    });
  }

  if (removals.length) {
    diffs.push({
      type: "REMOVE_SCALAR",
      props: Object.assign({}, ...removals)
    });
  }

  if (changes.length) {
    diffs.push({
      type: "CHANGE_SCALAR",
      props: Object.assign({}, ...changes)
    });
  }

  return diffs;
};

export const array = (
  query: RealEstateQueryArrays,
  key: ArrayKey,
  value: Filter["slug"][]
): ArrayDiff[] => {
  const additions = value.filter((v) => query[key].indexOf(v) === -1);
  const removals = query[key].filter((v) => value.indexOf(v) === -1);

  const diffs: ArrayDiff[] = [];

  if (additions.length) {
    diffs.push({ type: "ADD_ARRAY", key, values: additions });
  }

  if (removals.length) {
    diffs.push({ type: "REMOVE_ARRAY", key, values: removals });
  }

  return diffs;
};
