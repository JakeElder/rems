"use client";

import { Chat, ChatInput } from "@rems/ui";
import useAssistantState from "@/hooks/use-assistant-state";
import useAssistantCallbacks from "@/hooks/use-assistant-callbacks";
import useDomElements from "@/hooks/use-dom-elements";

type Props = {};

const ChatViewContainer = ({}: Props) => {
  const state = useAssistantState();
  const callbacks = useAssistantCallbacks();
  const { $chatInput } = useDomElements();

  // useEffect(() => {
  //   if (props.session.value) {
  //     if (props.session.state === "LISTENING") {
  //       Promise.resolve().then(() => {
  //         $input.current!.scrollLeft = $input.current!.scrollWidth;
  //       });
  //     }
  //   }
  // }, [props.session.value]);

  if (!state.ready) {
    return null;
  }

  const {
    lang,
    placement,
    mode,
    xDivide,
    marginTop,
    timeline,
    enterDown,
    sessions,
    submittable
  } = state;

  const { onChange, onKeyDown, onKeyUp } = callbacks;

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
