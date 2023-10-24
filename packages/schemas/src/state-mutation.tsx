import { z } from "zod";
import { PatchSchema } from "@rems/state";
import { AppStateSlicesSchema } from "./app-state-slices";

export const StateMutationSchema = z.object({
  prev: AppStateSlicesSchema,
  next: AppStateSlicesSchema,
  patch: PatchSchema
});
