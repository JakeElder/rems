import { useContext } from "react";
import { AssistantCallbackContext } from "@/components/client/AssistantCallbackProvider";

const useAssistantCallbacks = () => useContext(AssistantCallbackContext)!;

export default useAssistantCallbacks;
