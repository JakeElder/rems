import { init } from "./slices/app";

export type AppDispatch = ReturnType<typeof init>["store"]["dispatch"];
type ActionTypes = ReturnType<typeof init>["actions"];

export type AppAction = {
  [K in keyof ActionTypes]: ReturnType<ActionTypes[K]>;
}[keyof ActionTypes];

export * from "./types";
