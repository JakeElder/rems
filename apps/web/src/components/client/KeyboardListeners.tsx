"use client";

import useAssistantKeys from "@/hooks/use-assistant-keys";
import useDomElements from "@/hooks/use-dom-elements";
import {
  handleAssistantPlacementChangeRequest,
  handleSpaceKeyDown,
  handleSpaceKeyUp,
  useDispatch
} from "@/state";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";

type Props = {};

const KeyboardListeners = ({}: Props) => {
  const dispatch = useDispatch();
  const { resetTranscript } = useSpeechRecognition();
  const { $chatInput } = useDomElements();

  useAssistantKeys({
    spaceDown: () => {
      dispatch(handleSpaceKeyDown());
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    },
    spaceUp: () => {
      dispatch(handleSpaceKeyUp());
      SpeechRecognition.stopListening();
    },
    plus: () => {
      dispatch(handleAssistantPlacementChangeRequest("EXPAND"));
    },
    minus: () => {
      dispatch(handleAssistantPlacementChangeRequest("CONTRACT"));
    },
    escape: () => {
      dispatch(handleAssistantPlacementChangeRequest("MINIMIZE"));
    },
    leftBrace: () => {
      dispatch(handleAssistantPlacementChangeRequest("FRAME_LEFT"));
    },
    rightBrace: () => {
      dispatch(handleAssistantPlacementChangeRequest("FRAME_RIGHT"));
    }
  });

  return null;
};

export default KeyboardListeners;
