import { RealEstateQuerySchema } from "@rems/schemas";
import {
  Filter,
  RealEstateQuery,
  RealEstateQueryArrays,
  RealEstateQueryScalars
} from "@rems/types";

type ScalarKey = keyof RealEstateQueryScalars;
type ArrayKey = keyof RealEstateQueryArrays;

type AddScalarDiff = {
  type: "ADD_SCALAR";
  props: Partial<RealEstateQuery>;
};

type AddArrayDiff = {
  type: "ADD_ARRAY";
  key: ArrayKey;
  values: Filter["slug"][];
};

type RemoveScalarDiff = {
  type: "REMOVE_SCALAR";
  props: Partial<RealEstateQuery>;
};

type RemoveArrayDiff = {
  type: "REMOVE_ARRAY";
  key: ArrayKey;
  values: Filter["slug"][];
};

type ChangeScalarDiff = {
  type: "CHANGE_SCALAR";
  props: {
    [K in keyof RealEstateQuery]?: [RealEstateQuery[K], RealEstateQuery[K]];
  };
};

type ScalarDiff = AddScalarDiff | RemoveScalarDiff | ChangeScalarDiff;
type ArrayDiff = AddArrayDiff | RemoveArrayDiff;

export const scalar = (
  query: RealEstateQuery,
  patch: Partial<RealEstateQueryScalars>
): ScalarDiff[] => {
  const defaults = RealEstateQuerySchema.URL.parse({});
  const keys = Object.keys(patch) as ScalarKey[];

  const isAddition = (key: ScalarKey) =>
    query[key] === defaults[key] && patch[key] !== defaults[key];

  const isRemoval = (key: ScalarKey) =>
    patch[key] === defaults[key] && query[key] !== defaults[key];

  const isChange = (key: ScalarKey) =>
    !isAddition(key) && !isRemoval(key) && query[key] !== patch[key];

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
  query: RealEstateQuery,
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
