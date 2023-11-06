import React from "react";
import css from "./Patch.module.css";
import {
  AddArrayDiff,
  AddScalarDiff,
  ArrayDiff,
  ArrayPatch,
  ChangeScalarDiff,
  Patch as PatchType,
  RemoveArrayDiff,
  RemoveScalarDiff,
  ScalarDiff,
  ScalarPatch
} from "@rems/state";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faEquals,
  faMinus,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { animated, useTransition } from "@react-spring/web";

const AddArray = (diff: AddArrayDiff) => {
  return (
    <div className={css["add"]}>
      <div className={css["icon"]}>
        <FontAwesomeIcon icon={faPlus} size="sm" />
      </div>
      <div className={css["value"]}>{diff.value.slug as string}</div>
    </div>
  );
};

const RemoveArray = (diff: RemoveArrayDiff) => {
  return (
    <div className={css["remove"]}>
      <div className={css["icon"]}>
        <FontAwesomeIcon icon={faMinus} size="sm" />
      </div>
      <div className={css["value"]}>{diff.value.slug as string}</div>
    </div>
  );
};

const AddScalar = (diff: AddScalarDiff) => {
  return (
    <div className={css["add"]}>
      <div className={css["icon"]}>
        <FontAwesomeIcon icon={faPlus} size="sm" />
      </div>
      <div className={css["key"]}>{diff.prop}</div>
      <div className={css["colon"]}>:</div>
      <div className={css["value"]}>{diff.value}</div>
    </div>
  );
};

const RemoveScalar = (diff: RemoveScalarDiff) => {
  return (
    <div className={css["remove"]}>
      <div className={css["icon"]}>
        <FontAwesomeIcon icon={faMinus} size="sm" />
      </div>
      <div className={css["key"]}>{diff.prop}</div>
      <div className={css["colon"]}>:</div>
      <div className={css["value"]}>{diff.value}</div>
    </div>
  );
};

const ChangeScalar = (diff: ChangeScalarDiff) => {
  return (
    <div className={css["change"]}>
      <div className={css["icon"]}>
        <FontAwesomeIcon icon={faArrowRightArrowLeft} size="xs" />
      </div>
      <div className={css["key"]}>{diff.prop}</div>
      <div className={css["colon"]}>:</div>
      <div className={css["value"]}>{diff.value[0]}</div>
      <div className={css["direction"]}>⇒</div>
      <div className={css["value"]}>{diff.value[1]}</div>
    </div>
  );
};

const LineSwitch = (diff: ScalarDiff | ArrayDiff) => {
  if (diff.type === "ADD_TO_ARRAY") {
    return <AddArray {...diff} />;
  }

  if (diff.type === "REMOVE_FROM_ARRAY") {
    return <RemoveArray {...diff} />;
  }

  if (diff.type === "ADD_SCALAR") {
    return <AddScalar {...diff} />;
  }

  if (diff.type === "REMOVE_SCALAR") {
    return <RemoveScalar {...diff} />;
  }

  if (diff.type === "CHANGE_SCALAR") {
    return <ChangeScalar {...diff} />;
  }
};

const Line = (diff: ScalarDiff | ArrayDiff) => {
  return (
    <li className={css["item"]}>
      <LineSwitch {...diff} />
    </li>
  );
};

const Patch = (patch: PatchType) => {
  if (patch.diff.length === 0) {
    return (
      <div className={css["root"]}>
        <Noop {...patch} />
      </div>
    );
  }

  return <List diff={patch.diff} />;
};

const List = ({ diff }: { diff: (ScalarDiff | ArrayDiff)[] }) => {
  const transition = useTransition(diff, {
    trail: 300 / diff.length,
    from: { opacity: 0, x: 14 },
    enter: { opacity: 1, x: 0 }
  });

  return (
    <div className={css["root"]}>
      <ul className={css["list"]}>
        {transition((style, d) => (
          <animated.div style={style}>
            <Line {...d} key={`${d.type}.${d.value}`} />
          </animated.div>
        ))}
      </ul>
    </div>
  );
};

const Noop = (patch: PatchType) => {
  if (patch.type === "ARRAY") {
    return <ArrayNoop {...patch} />;
  }

  if (patch.type === "SCALAR") {
    return <ScalarNoop {...patch} />;
  }
};

const ArrayNoop = (patch: ArrayPatch) => {
  return (
    <div className={css["array-noop"]}>
      <div className={css["icon"]}>
        <FontAwesomeIcon icon={faEquals} size="sm" />
      </div>
      <div className={css["values"]}>
        {patch.value.map((p) => p.slug).join(", ")}
      </div>
    </div>
  );
};

const ScalarNoop = (patch: ScalarPatch) => {
  const keys = Object.keys(patch.data);
  const transition = useTransition(keys, {
    trail: 300 / keys.length,
    from: { opacity: 0, x: 14 },
    enter: { opacity: 1, x: 0 }
  });

  return (
    <ul className={css["list"]}>
      {transition((style, k) => (
        <animated.div style={style}>
          <li className={css["scalar-noop"]}>
            <div className={css["icon"]}>
              <FontAwesomeIcon icon={faEquals} size="sm" />
            </div>
            <div className={css["key"]}>{k}</div>
            <div className={css["colon"]}>:</div>
            <div className={css["value"]}>{(patch.data as any)[k]}</div>
          </li>
        </animated.div>
      ))}
    </ul>
  );
};

export default Patch;
