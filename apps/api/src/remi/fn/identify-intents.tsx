import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { stringify, timelineToCompletionMessages, execute } from "@/remi/utils";
import { intents } from "@/remi";
import {
  IntentSchema,
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
import md from "@rems/utils/md";

export const PropsSchema = z.object({
  currentLocation: LocationSchema,
  timeline: TimelineSchema,
  currentQuery: RealEstateQuerySchema
});

const ContextIntentSchema = IntentSchema.pick({
  id: true,
  code: true,
  description: true
});

export const ContextSchema = z.object({
  intents: z.array(ContextIntentSchema),
  definitions: z
    .object({
      indoorFeatures: z.array(z.string()),
      outdoorFeatures: z.array(z.string()),
      lotFeatures: z.array(z.string()),
      viewTypes: z.array(z.string()),
      propertyTypes: z.array(z.string())
    })
    .describe(md(<>Possible values</>)),
  currentLocation: LocationSchema,
  currentQuery: RealEstateQuerySchema
});

export const ReturnsSchema = z
  .object({
    i: z.array(
      TerseIntentSchema.shape["id"].describe(
        md(<>The array of user intents we need to resolve</>)
      )
    )
  })
  .transform(({ i }) => i);

type Props = Z<typeof PropsSchema>;
type Context = Z<typeof ContextSchema>;
type Returns = Z<typeof ReturnsSchema>;

const identifyIntents = async ({
  timeline,
  currentQuery,
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

  const context = stringify<Context>({
    intents: intents.map((i) => ContextIntentSchema.parse(i)),
    currentLocation,
    currentQuery,
    definitions: {
      indoorFeatures,
      outdoorFeatures,
      lotFeatures,
      viewTypes,
      propertyTypes
    }
  });

  const schema = stringify(
    zodToJsonSchema(ContextSchema.shape["currentQuery"], {})
  );

  const request = $request({
    ...$model(),
    ...$messages(
      $systemMessage(
        <>
          <p>
            You are Remi, a Thai born, bi-lingual assistant responsible for
            helping the user of a real estate website.
          </p>
          <p>The user has just yielded control to the assistant</p>
          <p>
            Analyze the chain of events, then identify the users intents with
            their latest message.
          </p>
          <p>
            Try to infer intents based on the timeline - IE "Go back to previous
            location" means the user is trying to REFINE_LOCATION
          </p>
        </>
      ),
      { role: "system", content: context },
      {
        role: "system",
        content: `This is the schema for the query: ${schema}`
      },
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({ returnsSchema: ReturnsSchema })
  });

  return execute.fn(request, ReturnsSchema);
};

export default identifyIntents;
