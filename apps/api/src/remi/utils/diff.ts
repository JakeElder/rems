import { RealEstateQuerySchema } from "@rems/schemas";
import {
  AddArrayDiff,
  AddScalarDiff,
  ArrayDiff,
  ArrayKey,
  ChangeScalarDiff,
  Filter,
  RealEstateQueryArrays,
  RealEstateQueryScalars,
  RemoveArrayDiff,
  RemoveScalarDiff,
  ScalarDiff,
  ScalarKey
} from "@rems/types";

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

  const additions = keys.filter(isAddition).map(
    (k): AddScalarDiff => ({
      type: "ADD_SCALAR",
      k: k,
      value: patch[k]
    })
  );

  const removals = keys.filter(isRemoval).map(
    (k): RemoveScalarDiff => ({
      type: "REMOVE_SCALAR",
      k: k,
      value: query[k]
    })
  );

  const changes = keys.filter(isChange).map(
    (k): ChangeScalarDiff => ({
      type: "CHANGE_SCALAR",
      k: k,
      value: [query[k], patch[k]]
    })
  );

  return [...additions, ...removals, ...changes];
};

export const array = (
  query: RealEstateQueryArrays,
  key: ArrayKey,
  value: Filter["slug"][]
): ArrayDiff[] => {
  const additions = value.filter((v) => query[key].indexOf(v) === -1);
  const removals = query[key].filter((v) => value.indexOf(v) === -1);

  const diffs: ArrayDiff[] = [
    ...additions.map(
      (value): AddArrayDiff => ({ type: "ADD_ARRAY", k: key, value })
    ),
    ...removals.map(
      (value): RemoveArrayDiff => ({ type: "REMOVE_ARRAY", k: key, value })
    )
  ];

  return diffs;
};
