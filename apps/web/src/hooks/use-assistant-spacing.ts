"use client";

import { Chat } from "@rems/ui";
import useDomElements from "@/hooks/use-dom-elements";

type Return = { ready: false } | ({ ready: true } & Chat.Spacing);

const useAssistantSpacing = (): Return => {
  const { $header, $listings } = useDomElements();

  const spacing = Chat.useAssistantSpacingUtility({
    $top: $header,
    $left: $listings
  });

  return spacing.ready ? { ready: true, ...spacing.props } : { ready: false };
};

export default useAssistantSpacing;
