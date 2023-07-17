import { ServerAction, ServerActionResult } from "@rems/types";
import { useRef, useState } from "react";
import update from "immutability-helper";
import { v4 as uuid } from "uuid";

type DormantUseServerActionState = {
  state: "dormant";
  count: 0;
  stale: null;
  pending: false;
  result: null;
};

type ActivatingUseServerActionState = {
  state: "activating";
  count: number;
  stale: boolean;
  pending: boolean;
  result: null | ServerActionResult;
};

type ActivatedUseServerActionState = {
  state: "activated";
  count: number;
  stale: boolean;
  pending: boolean;
  result: ServerActionResult;
};

type UseServerActionState =
  | DormantUseServerActionState
  | ActivatingUseServerActionState
  | ActivatedUseServerActionState;

type UseServerActionReturn<T> = UseServerActionState & {
  commit: (params: T) => void;
};

export default function useServerAction<T>(
  fn: ServerAction<T>
): UseServerActionReturn<T> {
  const [state, set] = useState<UseServerActionState>({
    state: "dormant",
    count: 0,
    stale: null,
    pending: false,
    result: null
  });

  const uuidStore = useRef<{ loaded: null | string; uuids: string[] }>({
    loaded: null,
    uuids: []
  });

  const commit: UseServerActionReturn<T>["commit"] = (params) => {
    const id = uuid();
    uuidStore.current = update(uuidStore.current, {
      uuids: { $push: [id] }
    });

    set((s) =>
      update(s, {
        state: {
          $set: s.state === "dormant" ? "activating" : (s.state as any)
        },
        count: { $set: s.count + 1 },
        stale: { $set: true },
        pending: { $set: true }
      })
    );

    fn(params, id).then((res) => {
      const { uuids } = uuidStore.current;
      const newer =
        uuidStore.current.loaded === null ||
        uuids.indexOf(uuidStore.current.loaded) > uuids.indexOf(res.uuid);

      if (!newer) {
        return;
      }
      const current =
        res.uuid ===
        uuidStore.current.uuids[uuidStore.current.uuids.length - 1];

      set((s) =>
        update(s, {
          state: { $set: "activated" },
          stale: { $set: !current },
          pending: { $set: !current },
          result: { $set: res }
        })
      );
    });
  };

  return { ...state, commit };
}
