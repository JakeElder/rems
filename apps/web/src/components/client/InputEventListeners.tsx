"use client";

import { store, useAssistantLanguage, useDispatch, useSession } from "@/state";
import { handover } from "@/utils";
import {
  handleAssistantPlacementChangeRequest,
  handleEmptySubmission,
  handleInputIdle,
  handleListeningAborted,
  handleListeningStarted,
  handleSpaceKeyDown,
  handleSpaceKeyUp,
  handleVoiceInputReceived,
  yld
} from "@rems/state/app/actions";
import { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { useDebouncedCallback } from "use-debounce";

type Props = {};

const isHTMLElement = (el: any): el is HTMLElement => el instanceof HTMLElement;

const InputEventListeners = ({}: Props) => {
  const dispatch = useDispatch();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const session = useSession();
  const language = useAssistantLanguage();

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

    handover(store.getState(), dispatch);
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

  return null;
};

export default InputEventListeners;
