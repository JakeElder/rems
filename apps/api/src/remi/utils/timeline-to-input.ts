import { Timeline } from "@rems/types";

const timelineToInput = (timeline: Timeline) => {
  const e = timeline[timeline.length - 1];
  if (e.role === "USER" && e.event.type === "LANGUAGE_BASED") {
    return e.event.message;
  }
  throw new Error("Invalid Timeline");
};

export default timelineToInput;
