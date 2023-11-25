import { init } from "./slices/app";
export type AppDispatch = ReturnType<typeof init>["dispatch"];
export * from "./types";
