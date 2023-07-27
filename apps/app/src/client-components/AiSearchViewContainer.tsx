"use client";

import "regenerator-runtime";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AiSearch } from "@rems/ui";
import { debounce } from "throttle-debounce";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { AiSearchInputState } from "@rems/types";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import { resolveNl } from "../api.client";
import useSWR from "swr";

type Props = {};

const AiSearchViewContainer = ({}: Props) => {
  const [value, setValue] = useState("");
  const { commit, query } = useRealEstateQuery();
  const [state, setState] = useState<AiSearchInputState>("inactive");
  const [activeSearch, setActiveSearch] = useState<null | string>(null);
  const $input = useRef<HTMLInputElement>(null);

  const { transcript, resetTranscript } = useSpeechRecognition();

  useSWR(
    activeSearch ? ["nl", activeSearch] : null,
    ([_, nl]) => resolveNl(query, nl),
    {
      onSuccess: (query) => {
        commit(query);
        setState("resolved");
        setTimeout(() => setState("inactive"), 2000);
      }
    }
  );

  useEffect(() => {
    if (state === "listening") {
      onInputReceived(transcript, true);
    }
  }, [transcript]);

  const onInputReceived = (value: string, fromSpeech: boolean = false) => {
    setValue(value);

    if (fromSpeech) {
      const $el = $input.current!;
      setTimeout(() => ($el.scrollLeft = 10000), 100);
    } else {
      resetTranscript();
      setState("inputting");
    }

    debouncedProcessInput(value);
  };

  const processInput = (value: string) => {
    SpeechRecognition.stopListening();
    if (value.length === 0) {
      commit({});
      setState("inactive");
    } else {
      setState("resolving");
      setActiveSearch(value);
    }
  };

  const debouncedProcessInput = useCallback(
    debounce(3000, processInput, { atBegin: false }),
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
