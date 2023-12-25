import { DeepPartial, configureStore } from "@reduxjs/toolkit";
import { AppState, AppStateSlices } from "@rems/types";
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

const factory = (initial: DeepPartial<AppStateSlices> = {}) => {
  return extend<AppStateSlices, DeepPartial<AppStateSlices>>(
    defaults().slices,
    initial
  );
};

export { defaults, init, factory };
