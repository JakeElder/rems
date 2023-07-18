import {
  ServerAction,
  UseWrappedServerActionReturn,
  UseWrappedServerActionState
} from "@rems/types";
import { useRef, useState } from "react";
import update from "immutability-helper";
import { v4 as uuid } from "uuid";

export default function useWrappedServerAction<T>(
  fn: ServerAction<T>
): UseWrappedServerActionReturn<T> {
  const [state, set] = useState<UseWrappedServerActionState>({
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

  const commit: UseWrappedServerActionReturn<T>["commit"] = async (params) => {
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

    const res = await fn(params, id);

    const { uuids } = uuidStore.current;
    const newer =
      uuidStore.current.loaded === null ||
      uuids.indexOf(uuidStore.current.loaded) > uuids.indexOf(res.uuid);

    if (!newer) {
      state.result;
    }

    const current =
      res.uuid === uuidStore.current.uuids[uuidStore.current.uuids.length - 1];

    set((s) =>
      update(s, {
        state: { $set: "activated" },
        stale: { $set: !current },
        pending: { $set: !current },
        result: { $set: res }
      })
    );

    return res;
  };

  return { ...state, commit };
}
