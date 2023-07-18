"use client";

import {
  ServerActionData,
  ServerActions,
  UseWrappedServerActionReturn
} from "@rems/types";
import { createContext, useContext } from "react";
import useWrappedServerAction from "../hooks/use-wrapped-server-action";

const ServerActionsContext = createContext<Partial<ServerActions> | null>(null);

export function useServerAction<T extends keyof ServerActionData>(
  action: T
): never | UseWrappedServerActionReturn<ServerActionData[T]> {
  const actions = useContext(ServerActionsContext);
  if (actions === null) {
    throw new Error();
  }

  const sa = actions[action];

  if (typeof sa === "undefined") {
    throw new Error();
  }

  return useWrappedServerAction(sa);
}

const Provider = (
  props: React.ComponentProps<typeof ServerActionsContext.Provider>
) => {
  return <ServerActionsContext.Provider {...props} />;
};

export default Provider;
