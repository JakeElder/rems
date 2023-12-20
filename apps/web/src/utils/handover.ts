import { AppDispatch } from "@rems/state";
import { AppAction, returnControl } from "@rems/state/app/actions";
import { AppState, AssistantPayload } from "@rems/types";
import { Observable, Subscriber } from "rxjs";

type Pump = (params: ReadableStreamReadResult<Uint8Array>) => void;

const handover = (state: AppState, dispatch: AppDispatch) => {
  const req = new Observable<AppAction>((sub) => {
    const payload: AssistantPayload = { state };
    fetch(`${process.env.NEXT_PUBLIC_REMS_API_URL}/assistant`, {
      method: "POST",
      body: JSON.stringify(payload)
    }).then((res) => handle(sub, res));
  });

  req.subscribe({
    next: (action) => {
      console.log(action);
      dispatch(action);

      if (action.type === "YIELD") {
        dispatch(returnControl());
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
