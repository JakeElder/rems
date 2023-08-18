import { Filter } from "@rems/types";
import { txt, openai, ChatCompletionRequest, RefineArrayReturn } from "@/remi";
import { ChatCompletionRequestMessageFunctionCall } from "openai";
import { FilterSchema } from "@rems/schemas";
import { zodToJsonSchema } from "zod-to-json-schema";

type ExecuteReturn =
  | { error: false; fc: ChatCompletionRequestMessageFunctionCall }
  | { error: true; message: string };

const execute = async (
  request: ChatCompletionRequest
): Promise<ExecuteReturn> => {
  try {
    const res = await openai.createChatCompletion(request);
    const message = res.data.choices[0].message!;
    return { error: false, fc: message.function_call! };
  } catch (e: any) {
    return { error: true, message: e.response.data };
  }
};

const arr = async ({
  type,
  filters,
  current,
  nl
}: {
  type: string;
  filters: Filter[];
  current: string[];
  nl: string;
}): Promise<RefineArrayReturn> => {
  const request: ChatCompletionRequest = {
    model: "gpt-4",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: txt(
          <>
            <p>
              You are Remi, an assistant responsible for helping the user of a
              real estate website. Your task is to;
            </p>
            <ul>
              <li>
                1. Take an array of "{type}". This is a list of items that the
                user may filter by.
                <br />
                This is the schema for a filter object: ```json
                {JSON.stringify(zodToJsonSchema(FilterSchema))}
                ```.
                <br />
                Here are *ALL* of the *available* filters: ```json
                {JSON.stringify(filters)}
                ```
              </li>
              <li>
                2. Take a command from the user, and identify which filters
                should be *removed*, and which need to be *added* in order to
                fulfill their command.
              </li>
            </ul>
            <p>Here are some important points;</p>
            <ul>
              <li>
                Only specify the numeric ids of filters that need to be removed.
                If the users command indicated that they would like to remove a
                certain filter, but it is not in the *currently active* array
                provided, then it does not need to be included for removal.
              </li>
              <li>
                Disregard any part of the users command that is irrelevant to
                this task. The users command may involve other criteria not
                relating to indoor features. You may focus only on indoor
                features, and only work with the indoor features specified
                explicity in this message.
              </li>
              <li>
                Do *not* speculate. Only include id's that exist within our data
                set. That is, do *not* add items to this array unless the user
                has mentioned them explicitly.
              </li>
              <li>
                Only include ids that you are confident the user has requested
                be added/removed.
              </li>
              <li>
                Do not extrapolate. Only include filters that the user has been
                verbose in specifying, and that exist within our data set.
              </li>
            </ul>
          </>
        )
      },
      {
        role: "user",
        content: nl
      }
    ],
    function_call: { name: "u" },
    functions: [
      {
        name: "u",
        description: txt(
          <>
            The function to be invoked that will remove and add entries to the
            indoor features array.
          </>
        ),
        parameters: {
          type: "object",
          properties: {
            r: {
              type: "array",
              items: { type: "number" },
              description: txt(
                <>
                  The ids of the filters that need to be *removed* from the
                  array in order to fulfill the users command. Only include ids
                  of filters that are currently active.
                </>
              )
            },
            a: {
              type: "array",
              items: { type: "number" },
              description: txt(
                <>
                  The ids of the filters that need to be *added* to the array in
                  order to fulfill the users command.
                </>
              )
            }
          }
        }
      }
    ]
  };

  const res = await execute(request);

  if (res.error === true) {
    return {
      ok: false,
      error: res.error
    };
  }

  const json = JSON.parse(res.fc.arguments!);
  const mapIds = (id: number) => filters.find((f) => f.id === id)?.slug;

  const rm: Filter["slug"][] = (json.r || []).map(mapIds);
  const add: Filter["slug"][] = (json.a || []).map(mapIds);

  const withoutRemoved = current.filter((f) => !rm.includes(f));
  const next = [
    ...withoutRemoved,
    ...add.filter((f) => !withoutRemoved.includes(f))
  ];

  return { ok: true, data: next };
};

export default arr;
