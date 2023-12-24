"use client";

import { useCallback, useEffect, useState } from "react";
import "regenerator-runtime";

import { TimelineEvent } from "@rems/types";
import { createContext } from "react";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { useDebouncedCallback } from "use-debounce";
import { store, useAssistantLanguage, useDispatch, useSession } from "@/state";
import {
  handleAssistantPlacementChangeRequest,
  handleEmptySubmission,
  handleInputIdle,
  handleKeyboardInputReceived,
  yld,
  handleSpaceKeyUp,
  handleListeningStarted,
  handleListeningAborted,
  handleVoiceInputReceived,
  handleSpaceKeyDown
} from "@rems/state/app/actions";
import { handover } from "@/utils";
import useProperties from "@/hooks/use-properties";

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
const isHTMLElement = (el: any): el is HTMLElement => el instanceof HTMLElement;

const AssistantCallbackProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const session = useSession();
  const language = useAssistantLanguage();
  const { data, isLoading } = useProperties({ target: "LISTINGS" });
  const [yielding, setYielding] = useState(false);

  useEffect(() => {
    if (listening) {
      setTimeout(() => {
        dispatch(handleListeningStarted());
      }, 100);
      return;
    } else if (session.value) {
      setTimeout(() => {
        resetTranscript();
      }, 100);
      handleYield();
    } else {
      setTimeout(() => {
        resetTranscript();
        dispatch(handleListeningAborted());
      }, 100);
    }
  }, [listening, resetTranscript]);

  useEffect(() => {
    if (listening) {
      dispatch(handleVoiceInputReceived(transcript));
    }
  }, [listening, transcript]);

  useEffect(() => {
    if (yielding && !isLoading && data) {
      const ids = data.data.map((p) => p.id);
      handover({ state: store.getState(), properties: ids }, dispatch);
      setYielding(false);
    }
  }, [yielding, isLoading]);

  const debouncedSetInactive = useDebouncedCallback(
    () => dispatch(handleInputIdle()),
    500
  );

  const handleYield = () => {
    debouncedSetInactive.cancel();

    if (session.value.length === 0) {
      dispatch(handleEmptySubmission());
      throw new Error();
    }

    dispatch(
      yld({
        role: "USER",
        message: session.value,
        state: store.getState().slices
      })
    );

    setYielding(true);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (isHTMLElement(e.target) && e.target.nodeName === "INPUT") {
          return;
        }
        e.preventDefault();
        if (e.repeat) {
          return;
        }
        dispatch(handleSpaceKeyDown());
        resetTranscript();
        SpeechRecognition.startListening({
          continuous: true,
          language: language === "EN" ? "en-GB" : "th-TH"
        });
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        dispatch(handleAssistantPlacementChangeRequest("MINIMIZE"));
      }
      if (e.code === "Space") {
        if (isHTMLElement(e.target) && e.target.nodeName === "INPUT") {
          return;
        }
        e.preventDefault();
        dispatch(handleSpaceKeyUp());
        SpeechRecognition.stopListening();
        resetTranscript();
      }
    };

    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === "+") {
        dispatch(handleAssistantPlacementChangeRequest("EXPAND"));
      }

      if (e.key === "{") {
        dispatch(handleAssistantPlacementChangeRequest("FRAME_LEFT"));
      }

      if (e.key === "}") {
        dispatch(handleAssistantPlacementChangeRequest("FRAME_RIGHT"));
      }

      if (e.key === "-" || e.key === "_") {
        dispatch(handleAssistantPlacementChangeRequest("CONTRACT"));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keypress", onKeyPress);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keypress", onKeyPress);
    };
  }, [resetTranscript, language]);

  const onKeyDown: Context["onKeyDown"] = useCallback((e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      dispatch({ type: "ENTER_KEY_DOWN" });
    }
  }, []);

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
      SpeechRecognition.startListening({
        language: language === "EN" ? "en-GB" : "th-TH"
      });
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
