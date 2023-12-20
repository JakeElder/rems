"use client";

import { useCallback } from "react";
import "regenerator-runtime";

import { TimelineEvent } from "@rems/types";
import { createContext } from "react";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { useDebouncedCallback } from "use-debounce";
import { store, useDispatch, useSession } from "@/state";
import {
  handleEmptySubmission,
  handleInputIdle,
  handleKeyboardInputReceived,
  handleUserYield
} from "@rems/state/app/actions";
import { handover } from "@/utils";

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

  const handleYield = useCallback(() => {
    debouncedSetInactive.cancel();

    if (session.value.length === 0) {
      dispatch(handleEmptySubmission());
      throw new Error();
    }

    const state = store.getState();

    dispatch(
      handleUserYield({
        state: state.slices,
        message: session.value
      })
    );

    const req = handover(state);

    req.subscribe({
      next: (action) => {
        console.log(action);
        dispatch(action);
      }
    });
  }, [session]);

  const onKeyUp: Context["onKeyUp"] = useCallback(
    (e) => {
      if (e.code === "Enter") {
        e.preventDefault();
        dispatch({ type: "ENTER_KEY_UP" });
        handleYield();
      }
    },
    [handleYield]
  );

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
