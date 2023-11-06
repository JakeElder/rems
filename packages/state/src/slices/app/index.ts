import { DeepPartial } from "@reduxjs/toolkit";
import { AppStateSlices } from "@rems/types";
import extend from "deep-extend";

import { default as init } from "./slice";
import { default as defaults } from "./defaults";

export { init, defaults };

export const factory = (
  initial: DeepPartial<AppStateSlices>
): AppStateSlices => {
  return extend<AppStateSlices, DeepPartial<AppStateSlices>>(
    defaults().slices,
    initial
  );
};
