import { ZodType } from "zod";
import { Z, Patch } from "./types";
import * as diff from "./diff";

export type Group<Id extends string, S extends ZodType<any>> = {
  id: Id;
  k: string;
  schema: S;
};

type ModuleSchema<M extends Group<any, any>, Id> = Extract<
  M,
  { id: Id }
>["schema"];

const store = <S extends ZodType<any>, G extends Group<any, any>>({
  schema,
  groups
}: {
  schema: S;
  groups: G[];
}): {
  state: Z<S>;
  update: <T extends G["id"]>(
    id: T,
    data: Partial<Z<ModuleSchema<G, T>>>
  ) => { next: Z<S>; patch: Patch };
} => {
  let state = schema.parse({});
  return {
    update: (id, data) => {
      const group = groups.find((a) => a.id === id)!;
      const prev = state[group.k];
      const defaults = schema.parse({});

      if (Array.isArray(defaults[group.k])) {
        state = schema.parse({ ...state, [group.k]: data });
        return {
          next: state,
          patch: {
            type: "ARRAY",
            group: group.id,
            k: group.k,
            value: data as any,
            diff: diff.array(prev, data as any)
          }
        };
      }

      state = schema.parse({
        ...state,
        [group.k]: {
          ...state[group.k],
          ...data
        }
      });

      return {
        next: state,
        patch: {
          type: "SCALAR",
          group: group.id,
          data: data as any,
          diff: diff.scalar(defaults[group.k], prev, data)
        }
      };
    },
    state
  };
};

export default store;
