import React from "react";
import css from "./Patch.module.css";
import {
  AddArrayDiff,
  AddScalarDiff,
  ArrayDiff,
  ChangeScalarDiff,
  Patch as PatchType,
  RemoveArrayDiff,
  RemoveScalarDiff,
  ScalarDiff
} from "@rems/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
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

export default Patch;
