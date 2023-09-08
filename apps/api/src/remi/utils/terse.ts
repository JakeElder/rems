import { Capability, CapabilityCode, Intent, IntentCode } from "@rems/types";
import { intents, capabilities } from "..";

const capability = (id: Capability["id"]): CapabilityCode => {
  const i = capabilities.find((i) => i.id === id);
  if (!i) throw new Error();
  return i.code;
};

const intent = (id: Intent["id"]): IntentCode | undefined =>
  intents.find((i) => i.id === id)?.code;

const intentArr = (arr: Intent["id"][]) => {
  const isCode = (s: any): s is IntentCode => typeof s !== "undefined";
  return arr.map(intent).filter(isCode);
};

export { capability, intent, intentArr as intents };
