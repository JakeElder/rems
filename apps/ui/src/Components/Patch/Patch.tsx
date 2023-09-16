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
} from "@rems/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faEquals,
  faMinus,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

const AddArray = (diff: AddArrayDiff) => {
  return (
    <div className={css["add"]}>
      <div className={css["icon"]}>
        <FontAwesomeIcon icon={faPlus} size="sm" />
      </div>
      <div className={css["value"]}>{diff.value}</div>
    </div>
  );
};

const RemoveArray = (diff: RemoveArrayDiff) => {
  return (
    <div className={css["remove"]}>
      <div className={css["icon"]}>
        <FontAwesomeIcon icon={faMinus} size="sm" />
      </div>
      <div className={css["value"]}>{diff.value}</div>
    </div>
  );
};

const AddScalar = (diff: AddScalarDiff) => {
  return (
    <div className={css["add"]}>
      <div className={css["icon"]}>
        <FontAwesomeIcon icon={faPlus} size="sm" />
      </div>
      <div className={css["key"]}>{diff.k}</div>
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
      <div className={css["key"]}>{diff.k}</div>
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
      <div className={css["key"]}>{diff.k}</div>
      <div className={css["colon"]}>:</div>
      <div className={css["value"]}>{diff.value[0]}</div>
      <div className={css["direction"]}>⇒</div>
      <div className={css["value"]}>{diff.value[1]}</div>
    </div>
  );
};

const LineSwitch = (diff: ScalarDiff | ArrayDiff) => {
  if (diff.type === "ADD_ARRAY") {
    return <AddArray {...diff} />;
  }

  if (diff.type === "REMOVE_ARRAY") {
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

  return (
    <div className={css["root"]}>
      <ul className={css["list"]}>
        {patch.diff.map((d) => (
          <Line {...d} />
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
      <div className={css["values"]}>{patch.value.join(", ")}</div>
    </div>
  );
};

const ScalarNoop = (patch: ScalarPatch) => {
  return (
    <ul className={css["list"]}>
      {Object.keys(patch.data).map((k) => (
        <li className={css["scalar-noop"]}>
          <div className={css["icon"]}>
            <FontAwesomeIcon icon={faEquals} size="sm" />
          </div>
          <div className={css["key"]}>{k}</div>
          <div className={css["colon"]}>:</div>
          <div className={css["value"]}>{(patch.data as any)[k]}</div>
        </li>
      ))}
    </ul>
  );
};

export default Patch;
