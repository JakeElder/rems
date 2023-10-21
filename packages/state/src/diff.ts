import { ZodType } from "zod";
import {
  Z,
  AddScalarDiff,
  RemoveScalarDiff,
  ChangeScalarDiff,
  ScalarDiff,
  Identifiable,
  ArrayDiff,
  AddArrayDiff,
  RemoveArrayDiff
} from "./types";

export const scalar = <S extends ZodType<any>>(
  defaults: Z<S>,
  state: Z<S>,
  patch: Partial<Z<S>>
): ScalarDiff[] => {
  const keys = Object.keys(patch) as Z<S>;

  const isAddition = (k: string) =>
    state[k] === defaults[k] && patch[k] !== defaults[k];

  const isRemoval = (k: string) =>
    patch[k] === defaults[k] && state[k] !== defaults[k];

  const isChange = (k: string) =>
    !isAddition(k) && !isRemoval(k) && state[k] !== patch[k];

  const additions = keys.filter(isAddition).map(
    (k: string): AddScalarDiff => ({
      type: "ADD_SCALAR",
      k,
      value: patch[k]
    })
  );

  const removals = keys.filter(isRemoval).map(
    (k: string): RemoveScalarDiff => ({
      type: "REMOVE_SCALAR",
      k,
      value: state[k]
    })
  );

  const changes = keys.filter(isChange).map(
    (k: string): ChangeScalarDiff => ({
      type: "CHANGE_SCALAR",
      k,
      value: [state[k], patch[k]]
    })
  );

  return [...additions, ...removals, ...changes];
};

export const array = (
  prev: Identifiable[],
  next: Identifiable[]
): ArrayDiff[] => {
  const additions = next.filter(
    (v) => prev.findIndex((pv) => pv.id === v.id) === -1
  );

  const removals = prev.filter(
    (v) => next.findIndex((pv) => pv.id === v.id) === -1
  );

  const diffs: ArrayDiff[] = [
    ...additions.map((value): AddArrayDiff => ({ type: "ADD_ARRAY", value })),
    ...removals.map(
      (value): RemoveArrayDiff => ({ type: "REMOVE_ARRAY", value })
    )
  ];

  return diffs;
};
