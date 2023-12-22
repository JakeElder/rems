"use client";

import { Chat, ChatInput } from "@rems/ui";
import useAssistantState from "@/hooks/use-assistant-state";
import useAssistantCallbacks from "@/hooks/use-assistant-callbacks";
import useDomElements from "@/hooks/use-dom-elements";
import { useEffect } from "react";
import useAssistantSpacing from "@/hooks/use-assistant-spacing";

type Props = {};

const ChatViewContainer = ({}: Props) => {
  const spacing = useAssistantSpacing();
  const { onChange, onKeyDown, onKeyUp, onMicClick } = useAssistantCallbacks();
  const { $chatInput } = useDomElements();
  const {
    lang,
    placement,
    mode,
    timeline,
    enterDown,
    sessions,
    submittable,
    session
  } = useAssistantState();

  useEffect(() => {
    if (session.value) {
      if (mode === "LISTENING") {
        Promise.resolve().then(() => {
          $chatInput.current!.scrollLeft = $chatInput.current!.scrollWidth;
        });
      }
    }
  }, [session.value]);

  if (!spacing.ready) {
    return null;
  }

  const { xDivide, marginTop } = spacing;

  return (
    <Chat.Root
      placement={placement}
      mode={mode}
      xDivide={xDivide}
      marginTop={marginTop}
    >
      <Chat.Dialog>
        <Chat.Header mode={mode} lang={lang} />
        <Chat.Body timeline={timeline} />
      </Chat.Dialog>
      <Chat.Input>
        <ChatInput
          ref={$chatInput}
          theme="chat"
          enterDown={enterDown}
          sessions={sessions}
          onMicClick={onMicClick}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          submittable={submittable}
        />
      </Chat.Input>
    </Chat.Root>
  );
};

export default ChatViewContainer;
