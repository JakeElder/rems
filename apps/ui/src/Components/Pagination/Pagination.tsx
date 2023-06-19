import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import css from "./Pagination.module.css";

type Props = {};

const Pagination = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["next"]}>
        <a>Next</a>
      </div>
      <div className={css["pages"]}>
        <a className={css["active"]} href="#">
          1
        </a>
        <a className={css["page"]} href="#">
          2
        </a>
        <a className={css["page"]} href="#">
          3
        </a>
        <span className={css["ellipsis"]}>&hellip;</span>
        <a className={css["page"]} href="#">
          6
        </a>
        <a className={css["next-arrow"]}>
          <FontAwesomeIcon icon={faChevronRight} size="sm" />
        </a>
      </div>
    </div>
  );
};

export default Pagination;
