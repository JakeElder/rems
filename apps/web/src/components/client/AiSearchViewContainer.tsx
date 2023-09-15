"use client";

import "regenerator-runtime";
import React, { useEffect, useRef } from "react";
import { AiSearch } from "@rems/ui";
import useAssistant from "@/hooks/use-assistant";

const AiSearchViewContainer = () => {
  const assistant = useAssistant();
  const $input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (assistant.session.value) {
      if (assistant.state === "listening") {
        Promise.resolve().then(() => {
          $input.current!.scrollLeft = $input.current!.scrollWidth;
        });
      }
    }
  }, [assistant.session.value]);

  return (
    <AiSearch
      submittable={assistant.submittable}
      ref={$input}
      onMicClick={assistant.onMicClick}
      onKeyDown={assistant.onKeyDown}
      onKeyUp={assistant.onKeyUp}
      enterDown={assistant.enterDown}
      state={assistant.state}
      sessions={assistant.sessions}
      onChange={assistant.onChange}
    />
  );
};

export default AiSearchViewContainer;
