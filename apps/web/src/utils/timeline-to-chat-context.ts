import {
  AssistantMessage,
  AssitantTimelineEvent,
  ChatContext,
  ChatContextEntry,
  LanguageBasedReaction,
  Reaction,
  ReactionAssistantMessage,
  Timeline,
  TimelineEvent,
  UserInteraction,
  UserLanguageBasedInteraction,
  UserTimelineEvent
} from "@rems/types";

const isUserTimelineEvent = (e: TimelineEvent): e is UserTimelineEvent =>
  e.type === "USER";

const isAssistantTimelineEvent = (
  e: TimelineEvent
): e is AssitantTimelineEvent => e.type === "ASSISTANT";

const isLanguageBasedUserInteraction = (
  i: UserInteraction
): i is UserLanguageBasedInteraction =>
  i.type === "VERBAL" || i.type === "WRITTEN";

const isReactionAssistantMessage = (
  i: AssistantMessage
): i is ReactionAssistantMessage => i.type === "REACTION";

const isLanguageBasedReaction = (r: Reaction): r is LanguageBasedReaction =>
  r.type === "LANGUAGE_BASED";

const timelineToChatContext = (timeline: Timeline) => {
  return timeline.reduce<ChatContext>((p, e) => {
    if (
      isUserTimelineEvent(e) &&
      isLanguageBasedUserInteraction(e.interaction)
    ) {
      const entry: ChatContextEntry = {
        type: "MESSAGE",
        role: "USER",
        message: e.interaction.input,
        date: e.date
      };
      return [...p, entry];
    }

    if (
      isAssistantTimelineEvent(e) &&
      isReactionAssistantMessage(e.message) &&
      isLanguageBasedReaction(e.message.reaction)
    ) {
      const entry: ChatContextEntry = {
        type: "MESSAGE",
        role: "ASSISTANT",
        message: e.message.reaction.message,
        date: e.date
      };
      return [...p, entry];
    }

    return p;
  }, []);
};

export default timelineToChatContext;
