import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import css from "./CountAndSort.module.css";

type Props = { count: number };

const CountAndSort = ({ count }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["count"]}>{count} listings</div>
      <div className={css["sort"]}>
        <select className={css["select"]}>
          <option>Popular</option>
          <option>Lowest Price First</option>
          <option>Highest Price First</option>
          <option>Largest Area First</option>
          <option>Smallest Area First</option>
        </select>
        <div className={css["active"]}>
          <span className={css["label"]}>Sort:</span>
          <span className={css["selection"]}>Popular</span>
          <span className={css["icon"]}>
            <FontAwesomeIcon icon={faChevronDown} size="sm" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountAndSort;
