import util from "util";
export { default as fetch } from "./fetch";

export function log(v: any) {
  console.log(util.inspect(v, false, null, true));
}
