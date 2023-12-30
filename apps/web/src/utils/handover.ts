import { AppDispatch } from "@rems/state";
import {
  AppAction,
  returnControl,
  setAssistantChatting,
  setAssistantPlacement,
  setShowDistance
} from "@rems/state/app/actions";
import { Analysis, AssistantPayload } from "@rems/types";
import { Observable, Subscriber } from "rxjs";
import { Sound } from "@/utils";

type Pump = (params: ReadableStreamReadResult<Uint8Array>) => void;

const handover = (payload: AssistantPayload, dispatch: AppDispatch) => {
  const req = new Observable<AppAction>((sub) => {
    fetch(`${process.env.NEXT_PUBLIC_REMS_API_URL}/assistant`, {
      method: "POST",
      body: JSON.stringify(payload)
    }).then((res) => handle(sub, res));
  });

  let analysis: Analysis;

  req.subscribe({
    next: (action) => {
      if (action.type !== "NOOP") {
        console.log(action);
      }

      dispatch(action);

      if (action.type === "SET_PAGE_AND_SORT") {
        const { sort } = action.payload.data;
        if (sort === "FURTHEST_FIRST" || sort === "CLOSEST_FIRST") {
          setTimeout(() => {
            dispatch(setShowDistance({ role: "ASSISTANT", show: true }));
          }, 1000);
        }
      }

      if (action.type === "REGISTER_ANALYSIS") {
        analysis = action.payload;
      }

      if (action.type === "YIELD") {
        dispatch(setAssistantChatting());
        Sound.speak(action.payload.message).then(() => {
          dispatch(returnControl());

          if (analysis.intents.includes("END_ASSISTANT_SESSION")) {
            dispatch(setAssistantPlacement("MINIMISED"));
          }
        });
      }
    }
  });

  return req;
};

const handle = (sub: Subscriber<AppAction>, res: Response) => {
  if (!res.ok || !res.body) {
    sub.error();
    return;
  }

  const decoder = new TextDecoder();
  const reader = res.body.getReader();

  const pump: Pump = async ({ done, value }) => {
    if (done) {
      sub.complete();
      return;
    }

    const chunks: AppAction[] = decoder
      .decode(value)
      .split("\n")
      .filter(Boolean)
      .map((c) => JSON.parse(c));

    chunks.forEach((c) => sub.next(c));
    reader.read().then(pump);
  };

  reader.read().then(pump);
};

export default handover;
