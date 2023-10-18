import z from "zod";
import {
  MAX_LIVING_AREA_SIZES,
  MAX_LOT_SIZES,
  MIN_LIVING_AREA_SIZES,
  MIN_LOT_SIZES
} from "../constants";
import { txt } from "../utils";

export const SpaceRequirementsSchema = z.object({
  minBedrooms: z.coerce.number().default(0).catch(0),
  maxBedrooms: z.coerce.number().nullable().default(null).catch(null),
  minBathrooms: z.coerce.number().default(0).catch(0),
  minLivingArea: z.coerce
    .number()
    .default(0)
    .catch(0)
    .describe(
      txt(
        <>
          Possible values: `{" "}
          {JSON.stringify(MIN_LIVING_AREA_SIZES.map((s) => s.value))}`
        </>
      )
    ),
  maxLivingArea: z.coerce
    .number()
    .nullable()
    .default(null)
    .catch(null)
    .describe(
      txt(
        <>
          Possible values: `{" "}
          {JSON.stringify(MAX_LIVING_AREA_SIZES.map((s) => s.value))}`
        </>
      )
    ),
  minLotSize: z.coerce
    .number()
    .default(0)
    .catch(0)
    .describe(
      txt(
        <>
          The minimum lot size, specified in Meters Squared. Here are the
          possible values: `{JSON.stringify(MIN_LOT_SIZES.map((s) => s.value))}
          `. The user may *only select one of these values*. When the user
          specifies a value other than these, the closest match should be used.
        </>
      )
    ),
  maxLotSize: z.coerce
    .number()
    .nullable()
    .default(null)
    .catch(null)
    .describe(
      txt(
        <>
          The maximum lot size, specified in Meters Squared. Here are the
          possible values: `{JSON.stringify(MAX_LOT_SIZES.map((s) => s.value))}
          `. The user may *only select one of these values*. When the user
          specifies a value other than these, the closest match should be used.
        </>
      )
    )
});

export default SpaceRequirementsSchema;
