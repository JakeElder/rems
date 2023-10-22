import { ZodType } from "zod";
import { Z, Patch, Group, ExtractModuleSchema, DeepPartial } from "./types";
import * as diff from "./diff";
import extend from "deep-extend";

const store = <S extends ZodType<any>, G extends Group>({
  schema,
  groups,
  defaults,
  initial = {}
}: {
  schema: S;
  groups: G[];
  defaults: Z<S>;
  initial: DeepPartial<Z<S>>;
}): {
  initial: Z<S>;
  update: <T extends G["id"]>(
    id: T,
    data: Partial<Z<ExtractModuleSchema<G, T>>>
  ) => { next: Z<S>; patch: Patch };
} => {
  let state = schema.parse(extend({}, defaults, initial));

  return {
    update: (id, data) => {
      const group = groups.find((a) => a.id === id)!;
      const prev = state[group.id];

      if (group.type === "ARRAY") {
        state = schema.parse({ ...state, [group.id]: data });
        return {
          next: state,
          patch: {
            type: "ARRAY",
            group: group.id,
            prop: group.id,
            value: data as any,
            diff: diff.array(prev, data as any)
          }
        };
      }

      state = schema.parse({
        ...state,
        [group.id]: extend({}, defaults[group.id], {
          ...state[group.id],
          ...data
        })
      });

      return {
        next: state,
        patch: {
          type: "SCALAR",
          group: group.id,
          data: data as any,
          diff: diff.scalar(defaults[group.id], prev, data)
        }
      };
    },
    initial: state
  };
};

export default store;
