import z from "zod";
import {
  MAX_LIVING_AREA_SIZES,
  MAX_LOT_SIZES,
  MIN_LIVING_AREA_SIZES,
  MIN_LOT_SIZES
} from "./constants";
import md from "@rems/utils/md";

export const SpaceRequirementsSchema = z.object({
  minBedrooms: z.number(),
  maxBedrooms: z.number().nullable(),
  minBathrooms: z.number(),
  minLivingArea: z
    .number()
    .describe(
      md(<>Possible values: {MIN_LIVING_AREA_SIZES.map((s) => s.value)}</>)
    ),
  maxLivingArea: z
    .number()
    .nullable()
    .describe(
      md(<>Possible values: {MAX_LIVING_AREA_SIZES.map((s) => s.value)}</>)
    ),
  minLotSize: z
    .number()
    .describe(
      md(
        <>
          The minimum lot size, specified in Meters Squared. Here are the
          possible values: {MIN_LOT_SIZES.map((s) => s.value)}. The user may
          *only select one of these values*. When the user specifies a value
          other than these, the closest match should be used.
        </>
      )
    ),
  maxLotSize: z
    .number()
    .nullable()
    .describe(
      md(
        <>
          The maximum lot size, specified in Meters Squared. Here are the
          possible values: {MAX_LOT_SIZES.map((s) => s.value)}. The user may
          *only select one of these values*. When the user specifies a value
          other than these, the closest match should be used.
        </>
      )
    )
});
