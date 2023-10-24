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
    (prop: string): AddScalarDiff => ({
      type: "ADD_SCALAR",
      prop,
      value: patch[prop]
    })
  );

  const removals = keys.filter(isRemoval).map(
    (prop: string): RemoveScalarDiff => ({
      type: "REMOVE_SCALAR",
      prop,
      value: state[prop]
    })
  );

  const changes = keys.filter(isChange).map(
    (prop: string): ChangeScalarDiff => ({
      type: "CHANGE_SCALAR",
      prop,
      value: [state[prop], patch[prop]]
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
    ...additions.map(
      (value): AddArrayDiff => ({ type: "ADD_FROM_ARRAY", value })
    ),
    ...removals.map(
      (value): RemoveArrayDiff => ({ type: "REMOVE_FROM_ARRAY", value })
    )
  ];

  return diffs;
};
