"use client";

import "regenerator-runtime";
import React, { useCallback, useReducer, useRef } from "react";
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

type ComponentState = {
  value: string;
  state: AiSearchInputState;
  enterDown: boolean;
};

type ViewProps = React.ComponentProps<typeof AiSearch>;
type OnKeyDown = NonNullable<ViewProps["onKeyDown"]>;
type OnKeyUp = NonNullable<ViewProps["onKeyUp"]>;
type OnChange = NonNullable<ViewProps["onChange"]>;

type ComponentAction =
  | { type: "EMPTY_SUBMISSION" }
  | { type: "START_ASSISTANT_REQUEST" }
  | { type: "SUCCESSFUL_ASSISTANT_REQUEST" }
  | { type: "SESSION_COMPLETE" }
  | { type: "INPUT_IDLE" }
  | { type: "MIC_BUTTON_CLICKED" }
  | { type: "ENTER_KEY_DOWN" }
  | { type: "ENTER_KEY_UP" }
  | { type: "KEYBOARD_INPUT_RECEIVED"; value: string };

const reducer = (
  prev: ComponentState,
  action: ComponentAction
): ComponentState => {
  switch (action.type) {
    case "EMPTY_SUBMISSION":
      return { ...prev, state: "inactive" };

    case "START_ASSISTANT_REQUEST":
      return { ...prev, enterDown: false, state: "resolving" };

    case "SUCCESSFUL_ASSISTANT_REQUEST":
      return { ...prev, state: "resolved" };

    case "SESSION_COMPLETE":
      return { ...prev, state: "inactive" };

    case "INPUT_IDLE":
      return { ...prev, state: "inactive" };

    case "MIC_BUTTON_CLICKED":
      return {
        ...prev,
        state: prev.state === "listening" ? "inactive" : "listening"
      };

    case "ENTER_KEY_DOWN":
      return { ...prev, enterDown: true };

    case "ENTER_KEY_UP":
      return { ...prev, enterDown: false };

    case "KEYBOARD_INPUT_RECEIVED":
      return { ...prev, value: action.value, state: "inputting" };

    default:
      throw new Error("Invalid action type");
  }
};

const AiSearchViewContainer = ({}: Props) => {
  const [c, dispatch] = useReducer(reducer, {
    value: "",
    state: "inactive",
    enterDown: false
  });

  const { commit, query } = useRealEstateQuery();
  const $input = useRef<HTMLInputElement>(null);

  const execute = async () => {
    debouncedSetInactive.cancel();

    if (c.value.length === 0) {
      dispatch({ type: "EMPTY_SUBMISSION" });
      return;
    }

    dispatch({ type: "START_ASSISTANT_REQUEST" });
    const nextQuery = await fetcher(query, c.value);
    dispatch({ type: "SUCCESSFUL_ASSISTANT_REQUEST" });

    commit(nextQuery);
    setTimeout(() => dispatch({ type: "SESSION_COMPLETE" }), 2000);
  };

  const debouncedSetInactive = useDebouncedCallback(
    () => dispatch({ type: "INPUT_IDLE" }),
    500
  );

  const onMicClick = useCallback(
    () => dispatch({ type: "MIC_BUTTON_CLICKED" }),
    []
  );

  const onKeyDown: OnKeyDown = useCallback((e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      dispatch({ type: "ENTER_KEY_DOWN" });
    }
  }, []);

  const onKeyUp: OnKeyUp = useCallback(
    (e) => {
      if (e.code === "Enter") {
        e.preventDefault();
        dispatch({ type: "ENTER_KEY_UP" });
        execute();
      }
    },
    [execute]
  );

  const onChange: OnChange = useCallback((e) => {
    const { value } = e.currentTarget;
    dispatch({ type: "KEYBOARD_INPUT_RECEIVED", value });
    debouncedSetInactive();
  }, []);

  const submittable =
    !!c.value && (c.state === "inputting" || c.state === "inactive");

  return (
    <AiSearch
      submittable={submittable}
      ref={$input}
      onMicClick={onMicClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      enterDown={c.enterDown}
      state={c.state}
      value={c.value}
      onChange={onChange}
    />
  );
};

export default AiSearchViewContainer;
