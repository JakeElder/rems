import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import {
  txt,
  stringify,
  timelineToCompletionMessages,
  execute
} from "@/remi/utils";
import { intents } from "@/remi";
import {
  LocationSchema,
  RealEstateQuerySchema,
  TerseIntentSchema,
  TimelineSchema
} from "@rems/schemas";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Z } from "@rems/types";
import * as Models from "@/models";
import { Model } from "sequelize";

export const PropsSchema = z.object({
  currentLocation: LocationSchema,
  timeline: TimelineSchema,
  query: RealEstateQuerySchema.Server
});

export const ContextSchema = z.object({
  primaryIntents: z.lazy(() => z.array(TerseIntentSchema)),
  secondaryIntents: z.lazy(() => z.array(TerseIntentSchema)),
  indoorFeatures: z.array(z.string()),
  outdoorFeatures: z.array(z.string()),
  lotFeatures: z.array(z.string()),
  viewTypes: z.array(z.string()),
  propertyTypes: z.array(z.string()),
  currentLocation: LocationSchema,
  currentQuery: z.object({
    MAP_STATE: RealEstateQuerySchema.MapState,
    PAGE: RealEstateQuerySchema.Page,
    SORT: RealEstateQuerySchema.Sort,
    SPACE_REQUIREMENTS: RealEstateQuerySchema.SpaceRequirements,
    BUDGET_AND_AVAILABILITY: RealEstateQuerySchema.BudgetAndAvailability,
    INDOOR_FEATURES: RealEstateQuerySchema.Arrays.shape["indoor-features"],
    LOT_FEATURES: RealEstateQuerySchema.Arrays.shape["lot-features"],
    OUTDOOR_FEATURES: RealEstateQuerySchema.Arrays.shape["outdoor-features"],
    PROPERTY_TYPES: RealEstateQuerySchema.Arrays.shape["property-types"],
    VIEW_TYPES: RealEstateQuerySchema.Arrays.shape["view-types"]
  })
});

export const ReturnsSchema = z
  .object({
    p: TerseIntentSchema.shape["id"].describe(txt(<>The *primary* intent</>)),
    s: z
      .array(TerseIntentSchema.shape["id"])
      .describe(
        txt(
          <>
            An array of *Secondary Intents*. An array of id's that apply to this
            request.
          </>
        )
      )
  })
  .describe(
    txt(
      <>
        An object that contains all the data necessary to further process
        natural language issued to Remi as a command or enquiry.
      </>
    )
  )
  .transform(({ p, s }) => ({ primary: p, secondary: s }));

type Props = Z<typeof PropsSchema>;
type Context = Z<typeof ContextSchema>;
type Returns = Z<typeof ReturnsSchema>;

const identifyIntents = async ({
  timeline,
  query,
  currentLocation
}: Props): Promise<RemiResponse<Returns>> => {
  const parse = (r: Model<any, any>[]) => r.map((m: any) => m.slug);
  const [
    lotFeatures,
    outdoorFeatures,
    indoorFeatures,
    viewTypes,
    propertyTypes
  ] = await Promise.all([
    Models.LotFeature.findAll({ raw: true }).then(parse),
    Models.OutdoorFeature.findAll({ raw: true }).then(parse),
    Models.IndoorFeature.findAll({ raw: true }).then(parse),
    Models.ViewType.findAll({ raw: true }).then(parse),
    Models.PropertyType.findAll({ raw: true }).then(parse)
  ]);

  const currentQuery: z.infer<(typeof ContextSchema.shape)["currentQuery"]> = {
    VIEW_TYPES: query["view-types"],
    PROPERTY_TYPES: query["property-types"],
    LOT_FEATURES: query["lot-features"],
    OUTDOOR_FEATURES: query["outdoor-features"],
    INDOOR_FEATURES: query["indoor-features"],
    BUDGET_AND_AVAILABILITY:
      RealEstateQuerySchema.BudgetAndAvailability.parse(query),
    MAP_STATE: RealEstateQuerySchema.MapState.parse(query),
    SPACE_REQUIREMENTS: RealEstateQuerySchema.SpaceRequirements.parse(query),
    SORT: query["sort"],
    PAGE: query["page"]
  };

  const context = stringify<Context>({
    indoorFeatures,
    outdoorFeatures,
    lotFeatures,
    viewTypes,
    propertyTypes,
    currentLocation,
    primaryIntents: intents
      .filter((i) => i.primary)
      .map((i) => TerseIntentSchema.parse(i)),
    secondaryIntents: intents
      .filter((i) => !i.primary)
      .map((i) => TerseIntentSchema.parse(i)),
    currentQuery
  });

  const schema = stringify(
    zodToJsonSchema(ContextSchema.shape["currentQuery"])
  );

  const request = $request({
    ...$model(),
    ...$messages(
      $systemMessage(
        <>
          <p>
            You are Remi, an assistant responsible for helping the user of a
            real estate website. Process their input and analyze it for their
            intent. Select one primary intent, and as many secondary as
            required. Context will follow.
          </p>
        </>
      ),
      $systemMessage(context),
      $systemMessage(`This is the schema for the query: ${schema}`),
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({ returnsSchema: ReturnsSchema })
  });

  return execute.fn(request, ReturnsSchema);
};

export default identifyIntents;
