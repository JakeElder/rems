import { Intent, IntentCode } from "@rems/types";
import { intents } from "..";

const intent = (id: Intent["id"]): IntentCode | undefined =>
  intents.find((i) => i.id === id)?.code;

const intentArr = (arr: Intent["id"][]) => {
  const isCode = (s: any): s is IntentCode => typeof s !== "undefined";
  return arr.map(intent).filter(isCode);
};

export { intent, intentArr as intents };
