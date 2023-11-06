"use client";

import { useCallback } from "react";
import "regenerator-runtime";

import { TimelineEvent } from "@rems/types";
import { createContext } from "react";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { useDebouncedCallback } from "use-debounce";
import {
  store,
  handleEmptySubmission,
  handleInputIdle,
  handleKeyboardInputReceived,
  handleUserYield,
  useDispatch,
  useSession
} from "@/state";
import yld from "utils/yield";

type Props = {
  children: React.ReactNode;
};

type FormAttributes = React.FormHTMLAttributes<HTMLFormElement>;
type InputHTMLAttributes = React.InputHTMLAttributes<HTMLInputElement>;

type Context = {
  onKeyDown: NonNullable<FormAttributes["onKeyDown"]>;
  onKeyUp: NonNullable<FormAttributes["onKeyUp"]>;
  onMicClick: () => void;
  onChange: NonNullable<InputHTMLAttributes["onChange"]>;
  onEventRendered: (e: TimelineEvent) => void;
};

export const AssistantCallbackContext = createContext<Context | null>(null);

const AssistantCallbackProvider = ({ children }: Props) => {
  const { resetTranscript } = useSpeechRecognition();
  const dispatch = useDispatch();

  const debouncedSetInactive = useDebouncedCallback(
    () => dispatch(handleInputIdle()),
    500
  );

  const session = useSession();

  const onKeyDown: Context["onKeyDown"] = useCallback((e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      dispatch({ type: "ENTER_KEY_DOWN" });
    }
  }, []);

  const onKeyUp: Context["onKeyUp"] = useCallback((e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      dispatch({ type: "ENTER_KEY_UP" });
      handleYield();
    }
  }, []);

  const onMicClick: Context["onMicClick"] = useCallback(() => {
    if (session.state === "LISTENING") {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening();
    }
  }, []);

  const onChange: Context["onChange"] = useCallback((e) => {
    dispatch(handleKeyboardInputReceived(e.currentTarget.value));
    debouncedSetInactive();
  }, []);

  const onEventRendered: Context["onEventRendered"] = useCallback((e) => {
    console.log(e);
  }, []);

  const handleYield = () => {
    debouncedSetInactive.cancel();

    if (session.value.length === 0) {
      dispatch(handleEmptySubmission());
      throw new Error();
    }

    dispatch(handleUserYield(session.value));
    const req = yld(store.getState());

    req.subscribe({
      next: (e) => {
        console.log(e);
      }
    });
  };

  return (
    <AssistantCallbackContext.Provider
      value={{
        onKeyDown,
        onKeyUp,
        onMicClick,
        onChange,
        onEventRendered
      }}
      children={children}
    />
  );
};

export default AssistantCallbackProvider;
