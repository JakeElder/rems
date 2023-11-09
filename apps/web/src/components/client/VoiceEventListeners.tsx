"use client";

import {
  handleEmptySubmission,
  handleInputIdle,
  handleListeningAborted,
  handleListeningStarted,
  handleUserYield,
  handleVoiceInputReceived,
  store,
  useDispatch,
  useSession
} from "@/state";
import { yld } from "@/utils";
import { useEffect } from "react";
import { useSpeechRecognition } from "react-speech-recognition";
import { useDebouncedCallback } from "use-debounce";

type Props = {};

const VoiceEventListeners = ({}: Props) => {
  const { transcript, listening } = useSpeechRecognition();
  const dispatch = useDispatch();
  const session = useSession();

  useEffect(() => {
    if (listening) {
      setTimeout(() => {
        dispatch(handleListeningStarted());
      }, 100);
      return;
    } else if (session.value) {
      handleYield();
    } else {
      setTimeout(() => {
        dispatch(handleListeningAborted());
      }, 100);
    }
  }, [listening]);

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

    dispatch(handleUserYield(session.value));
    const req = yld(store.getState());

    req.subscribe({
      next: (e) => {
        console.log(e);
      }
    });
  };

  return null;
};

export default VoiceEventListeners;
