import { Capability, CapabilityCode, Intent, IntentCode } from "@rems/types";
import { intents, capabilities } from "..";

const capability = (id: Capability["id"]): CapabilityCode => {
  const i = capabilities.find((i) => i.id === id);
  if (!i) throw new Error();
  return i.code;
};

const intent = (id: Intent["id"]): IntentCode => {
  const i = intents.find((i) => i.id === id);
  if (!i) throw new Error();
  return i.code;
};

const intentArr = (arr: Intent["id"][]) => arr.map(intent);

export { capability, intent, intentArr as intents };
