import { NextRequest } from "next/server";
import { AssistantPayload } from "@rems/types";
import { AssistantPayloadSchema } from "@rems/schemas";
import {
  AppAction,
  returnControl,
  setSpaceRequirements
} from "@rems/state/app/actions";

type Stream = (args: AssistantPayload) => UnderlyingDefaultSource["start"];

const encoder = new TextEncoder();

const stream: Stream = (args) => async (c) => {
  const { state } = args;
  console.dir(state, { colors: true });

  const send = (e: AppAction) => {
    const chunk = encoder.encode(`${JSON.stringify(e)}\n`);
    c.enqueue(chunk);
  };

  send(
    setSpaceRequirements({
      role: "ASSISTANT",
      data: { minLotSize: 1000 }
    })
  );

  send(returnControl());

  c.close();
};

export async function POST(req: NextRequest) {
  const { state } = AssistantPayloadSchema.parse(await req.json());

  return new Response(new ReadableStream({ start: stream({ state }) }), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
