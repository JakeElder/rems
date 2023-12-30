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
  LocationSchema,
  PropertySchema,
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
  currentPropertiesOnPage: z.array(PropertySchema),
  timeline: TimelineSchema
});

export const ContextSchema = z.object({
  currentLocation: LocationSchema
});

export const ReturnsSchema = z
  .object({
    i: z.array(
      TerseIntentSchema.shape["id"].describe(
        md(<>The array of functions to call</>)
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
          <p>Choose functions that should be called to assist</p>
          <p>Some points to consider;</p>
          <ul>
            <li>
              You can and often should choose multiple functions, but only when
              sure.
            </li>
            <li>
              The user may want to move the position of the assistant, in this
              case CHANGE_ASSISTANT_POSITION should be chosen
            </li>
            <li>
              Only perform an action when the user has requested you do so. IE -
              if the user asks 'can you speak Thai' - just say yes, but don't
              switch the language yet.
            </li>
            <li>
              Make sure END_ASSISTANT_SESSION is used when it sounds as though
              the user has come to a resting point
            </li>
            <li>Pay attention to property types</li>
          </ul>
        </>
      ),
      {
        role: "system",
        content: `Available functions: ${JSON.stringify(
          intents.map((i) => ({
            id: i.id,
            name: i.code,
            description: i.description,
            examples: i.examples
          }))
        )}`
      },
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
