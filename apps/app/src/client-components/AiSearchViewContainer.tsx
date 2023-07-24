"use client";

import "regenerator-runtime";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AiSearch } from "@rems/ui";
import { debounce } from "throttle-debounce";
import { nlToQuery } from "../app/actions";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { AiSearchInputState } from "@rems/types";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";

type Props = {};

const AiSearchViewContainer = ({ }: Props) => {
  const [value, setValue] = useState("");
  const { commit } = useRealEstateQuery();
  const [state, setState] = useState<AiSearchInputState>("inactive");
  const $input = useRef<HTMLInputElement>(null);

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    onInputReceived(transcript, true);
  }, [transcript]);

  const search = async (value: string) => {
    if (!value) {
      commit({});
      setState("inactive");
      return;
    }

    if (value.length > 10) {
      const query = await nlToQuery(value);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setState("resolved");
      commit(query);
      setTimeout(() => setState("inactive"), 2000);
    }
  };

  const onInputReceived = (value: string, fromSpeech: boolean = false) => {
    if (!fromSpeech) {
      resetTranscript();
      setState("inputting");
    }

    setValue(value);

    if (fromSpeech) {
      const $el = $input.current!;
      setTimeout(() => {
        $el.scrollLeft = 10000;
      });
    }

    debouncedProcessInput(value);
  };

  const debouncedProcessInput = useCallback(
    debounce(
      3000,
      (value: string) => {
        setState("resolving");
        SpeechRecognition.stopListening();
        search(value);
      },
      { atBegin: false }
    ),
    []
  );

  const onMicClick = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
    setState("listening");
    debouncedProcessInput(value);
  };

  return (
    <AiSearch
      ref={$input}
      onMicClick={onMicClick}
      history={[]}
      state={state}
      value={value}
      onChange={(e) => {
        onInputReceived(e.currentTarget.value);
      }}
    />
  );
};

export default AiSearchViewContainer;
