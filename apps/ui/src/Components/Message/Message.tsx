import React from "react";
import css from "./Message.module.css";
import {
  AddScalarDiff,
  ArrayDiff,
  AssistantMessage,
  ChangeScalarDiff,
  LanguageBasedReaction,
  Patch,
  PatchReaction,
  RemoveScalarDiff,
  ScalarDiff,
  TimelineEvent,
  UserInteraction,
  UserLanguageBasedInteraction
} from "@rems/types";
import cn from "classnames";
import { titleCase } from "title-case";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faArrowRightArrowLeft
} from "@fortawesome/free-solid-svg-icons";

type Props = TimelineEvent;

const Message = (event: Props) => {
  return event.type === "USER" ? (
    <UserMessage {...event.interaction} />
  ) : (
    <AssistantMessage {...event.message} />
  );
};

const LanguageBasedUserMessage = (i: UserLanguageBasedInteraction) => {
  return (
    <div
      className={cn(css["message"], css["user-message"], css["language-based"])}
    >
      {i.input}
    </div>
  );
};

const UserMessage = (interaction: UserInteraction) => {
  const component = (() => {
    if (interaction.type === "WRITTEN" || interaction.type === "VERBAL") {
      return <LanguageBasedUserMessage {...interaction} />;
    }

    return null;
  })();

  return <div className={css["user-root"]}>{component}</div>;
};

const LanguageBasedAssistantReaction = (r: LanguageBasedReaction) => {
  return (
    <div
      className={cn(
        css["message"],
        css["assistant-message"],
        css["language-based"]
      )}
    >
      {r.message}
    </div>
  );
};

const AssistantPatch = (r: PatchReaction) => {
  return (
    <div className={css["assistant-patch-root"]}>
      <div className={css["assistant-patch-group"]}>
        {titleCase(r.group.replace(/_/g, " ").toLowerCase())}
      </div>
      <div className={css["assistant-diff"]}>
        <Diff {...r.patch} />
      </div>
    </div>
  );
};

const Diff = (patch: Patch) => {
  return patch.type === "ARRAY" ? (
    <Array diff={patch.diff} />
  ) : (
    <Scalar diff={patch.diff} />
  );
};

const Array = ({ diff }: { diff: ArrayDiff[] }) => {
  return (
    <ul className={css["array-diff"]}>
      {diff.map((d) => {
        return d.values.map((v, idx) => (
          <li
            key={`${d.key}.${idx}`}
            className={cn(
              css[d.type === "ADD_ARRAY" ? "add" : "remove"],
              css["diff-item"]
            )}
          >
            <div className={css["icon"]}>
              <FontAwesomeIcon
                icon={d.type === "ADD_ARRAY" ? faPlus : faMinus}
              />
            </div>
            {v}
          </li>
        ));
      })}
    </ul>
  );
};

const ScalarItem = (diff: ScalarDiff) => {
  if (diff.type === "CHANGE_SCALAR") {
    return <ChangeScalar {...diff} />;
  }

  if (diff.type === "ADD_SCALAR") {
    return <AddScalar {...diff} />;
  }

  if (diff.type === "REMOVE_SCALAR") {
    return <RemoveScalar {...diff} />;
  }
};

const ChangeScalar = (diff: ChangeScalarDiff) => {
  return Object.keys(diff.props).map((k) => (
    <li key={k} className={cn(css["diff-item"], css["change"])}>
      <div className={css["icon"]}>
        <FontAwesomeIcon icon={faArrowRightArrowLeft} />
      </div>
      <span className={css["key"]}>{k}</span>
      <span className={css["colon"]}>:</span>
      <span className={css["from"]}>{diff.props[k][0]}</span>
      <span className={css["direction"]}>⇒</span>
      <span className={css["to"]}>{diff.props[k][1]}</span>
    </li>
  ));
};

const AddScalar = (diff: AddScalarDiff) => {
  return Object.keys(diff.props).map((k) => (
    <li key={k} className={cn(css["diff-item"], css["add"])}>
      <div className={css["icon"]}>
        <FontAwesomeIcon icon={faPlus} />
      </div>
      <span className={css["key"]}>{k}</span>
      <span className={css["colon"]}>:</span>
      <span className={css["val"]}>{(diff.props as any)[k]}</span>
    </li>
  ));
};

const RemoveScalar = (diff: RemoveScalarDiff) => {
  return Object.keys(diff.props).map((k) => (
    <li key={k} className={cn(css["diff-item"], css["remove"])}>
      <div className={css["icon"]}>
        <FontAwesomeIcon icon={faMinus} />
      </div>
      <span className={css["key"]}>{k}</span>
      <span className={css["colon"]}>:</span>
      <span className={css["val"]}>{(diff.props as any)[k]}</span>
    </li>
  ));
};

const Scalar = ({ diff }: { diff: ScalarDiff[] }) => {
  return (
    <ul className={css["scalar-diff"]}>
      {diff.map((d) => {
        return <ScalarItem key={Object.keys(d.props).join(".")} {...d} />;
      })}
    </ul>
  );
};

const AssistantMessage = (message: AssistantMessage) => {
  if (message.type !== "REACTION") {
    return null;
  }

  const { reaction } = message;

  const component = (() => {
    if (reaction.type === "LANGUAGE_BASED") {
      return <LanguageBasedAssistantReaction {...reaction} />;
    }

    if (reaction.type === "PATCH") {
      return <AssistantPatch {...reaction} />;
    }

    return null;
  })();

  return <div className={css["assistant-root"]}>{component}</div>;
};

export default Message;
