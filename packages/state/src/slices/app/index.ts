import { DeepPartial, configureStore } from "@reduxjs/toolkit";
import { AppState } from "@rems/types";
import extend from "deep-extend";

import { default as defaults } from "./defaults";
import { default as reducer } from "./reducer";

const init = (initialState: DeepPartial<AppState> = {}) => {
  const preloadedState = extend<AppState, DeepPartial<AppState>>(
    defaults(),
    initialState
  );

  return configureStore({ reducer, preloadedState });
};

export { defaults, init };
