"use client";

import "regenerator-runtime";
import React, { useEffect, useRef, useState } from "react";
import { AiSearch } from "@rems/ui";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import {
  AiSearchInputState,
  PartialRealEstateQuery,
  RealEstateQuery
} from "@rems/types";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import useSWR from "swr";
import { useDebouncedCallback } from "use-debounce";

type Props = {};

type Fetcher = (
  query: PartialRealEstateQuery,
  nl: string
) => Promise<RealEstateQuery>;

const fetcher: Fetcher = async (query, nl) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_REMS_API_URL}/assistant`, {
    method: "POST",
    body: JSON.stringify({ query, nl })
  });
  return res.json();
};

const AiSearchViewContainer = ({}: Props) => {
  const [value, setValue] = useState("");
  const { commit, query } = useRealEstateQuery();
  const [state, setState] = useState<AiSearchInputState>("inactive");
  const [activeSearch, setActiveSearch] = useState<null | string>(null);
  const $input = useRef<HTMLInputElement>(null);

  const { transcript, resetTranscript } = useSpeechRecognition({
    clearTranscriptOnListen: true
  });

  useSWR(
    activeSearch ? [activeSearch, "nl"] : null,
    ([nl]) => fetcher(query, nl),
    {
      onSuccess: (query) => {
        commit(query);
        setState("resolved");
        setTimeout(() => setState("inactive"), 2000);
      },
      revalidateOnFocus: false
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
      setState("inputting");
    }

    debouncedExecute();
  };

  const execute = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
    if (value.length === 0) {
      setState("inactive");
    } else {
      setState("resolving");
      setActiveSearch(value);
    }
  };

  const debouncedExecute = useDebouncedCallback(execute, 2500);

  const onMicClick = () => {
    setValue("");
    SpeechRecognition.startListening({ continuous: true });
    setState("listening");
    debouncedExecute();
  };

  return (
    <AiSearch
      ref={$input}
      onMicClick={onMicClick}
      onSubmit={(e) => {
        e.preventDefault();
        debouncedExecute.cancel();
        execute();
      }}
      state={state}
      value={value}
      onChange={(e) => {
        onInputReceived(e.currentTarget.value);
      }}
    />
  );
};

export default AiSearchViewContainer;
