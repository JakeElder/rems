import { RemiResponse } from "@/remi/types";
import {
  $functionCall,
  $messages,
  $model,
  $request,
  $systemMessage
} from "@/remi/wrappers";
import { timelineToCompletionMessages, execute, stringify } from "@/remi/utils";
import { intents } from "@/remi";
import {
  IntentSchema,
  LocationSchema,
  TerseIntentSchema,
  TimelineSchema
} from "@rems/schemas";
import { z } from "zod";
import { Z } from "@rems/types";
import * as Models from "@/models";
import { Model } from "sequelize";
import md from "@rems/utils/md";

export const PropsSchema = z.object({
  currentLocation: LocationSchema,
  timeline: TimelineSchema
});

const ContextIntentSchema = IntentSchema.pick({
  id: true,
  code: true,
  description: true
});

export const ContextSchema = z.object({
  intents: z.array(ContextIntentSchema),
  currentLocation: LocationSchema
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

  const filters = {
    INDOOR_FEATURES: indoorFeatures,
    OUTDOOR_FEATURES: outdoorFeatures,
    LOT_FEATURES: lotFeatures,
    VIEW_TYPES: viewTypes,
    PROPERTY_TYPES: propertyTypes
  };

  const context = stringify<Context>({
    intents: intents.map((i) => ContextIntentSchema.parse(i)),
    currentLocation
  });

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
        </>
      ),
      {
        role: "system",
        content: `Here is context ${JSON.stringify(context)}`
      },
      {
        role: "system",
        content: `These are the possible filters. Pay attention to which type of filters there are ${JSON.stringify(
          filters
        )}`
      },
      ...timelineToCompletionMessages(timeline)
    ),
    ...$functionCall({ returnsSchema: ReturnsSchema })
  });

  return execute.fn(request, ReturnsSchema);
};

export default identifyIntents;
