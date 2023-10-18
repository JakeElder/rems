import z from "zod";
import {
  MAX_LIVING_AREA_SIZES,
  MAX_LOT_SIZES,
  MIN_LIVING_AREA_SIZES,
  MIN_LOT_SIZES
} from "../constants";
import { txt } from "../utils";

export const SpaceRequirementsSchema = z
  .object({
    minBedrooms: z.number(),
    maxBedrooms: z.number().nullable(),
    minBathrooms: z.number(),
    minLivingArea: z
      .number()
      .describe(
        txt(
          <>
            Possible values: `{" "}
            {JSON.stringify(MIN_LIVING_AREA_SIZES.map((s) => s.value))}`
          </>
        )
      ),
    maxLivingArea: z
      .number()
      .nullable()
      .describe(
        txt(
          <>
            Possible values: `{" "}
            {JSON.stringify(MAX_LIVING_AREA_SIZES.map((s) => s.value))}`
          </>
        )
      ),
    minLotSize: z.number().describe(
      txt(
        <>
          The minimum lot size, specified in Meters Squared. Here are the
          possible values: `{JSON.stringify(MIN_LOT_SIZES.map((s) => s.value))}
          `. The user may *only select one of these values*. When the user
          specifies a value other than these, the closest match should be used.
        </>
      )
    ),
    maxLotSize: z
      .number()
      .nullable()
      .describe(
        txt(
          <>
            The maximum lot size, specified in Meters Squared. Here are the
            possible values: `
            {JSON.stringify(MAX_LOT_SIZES.map((s) => s.value))}
            `. The user may *only select one of these values*. When the user
            specifies a value other than these, the closest match should be
            used.
          </>
        )
      )
  })
  .default({
    minBedrooms: 0,
    maxBedrooms: null,
    minBathrooms: 0,
    minLivingArea: 0,
    maxLivingArea: null,
    minLotSize: 0,
    maxLotSize: null
  });

export default SpaceRequirementsSchema;
