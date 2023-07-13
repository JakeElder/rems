"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft
} from "@fortawesome/free-solid-svg-icons";
import css from "./Pagination.module.css";
import {
  generateQueryString,
  useRealEstateQuery
} from "../RealEstateQueryController";
import ReactPaginate from "react-paginate";
import Link from "next/link";

type Props = {};

const Pagination = ({}: Props) => {
  const { state, query, onPageChange } = useRealEstateQuery();

  const pageCount = Math.max(
    state.initialLoad
      ? 1
      : Math.ceil(
          state.result.pagination.total / state.result.pagination.pageSize
        ),
    1
  );

  if (!state.initialLoad && state.result.pagination.total === 0) {
    return null;
  }

  return (
    <div className={css["root"]}>
      <div className={css["next"]}>
        {pageCount > query["page"] ? (
          <Link
            className={css["button"]}
            children="Next"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(query["page"] + 1);
            }}
            href={`/real-estate/?${generateQueryString(
              query,
              query["page"] + 1
            )}`}
          />
        ) : (
          <div className={`${css["button"]} ${css["inactive"]}`}>Next</div>
        )}
      </div>
      <div className={css["pages"]}>
        <ReactPaginate
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          breakClassName={css["ellipsis"]}
          breakLabel={<>&hellip;</>}
          previousLinkClassName={css["prev-arrow"]}
          nextLinkClassName={css["next-arrow"]}
          previousLabel={<FontAwesomeIcon icon={faChevronLeft} size="sm" />}
          nextLabel={<FontAwesomeIcon icon={faChevronRight} size="sm" />}
          pageLinkClassName={css["page"]}
          containerClassName={css["pages"]}
          activeLinkClassName={css["active"]}
          hrefBuilder={(page) => {
            return `/real-estate/?${generateQueryString(query, page)}`;
          }}
          onClick={({ nextSelectedPage }) => {
            if (state.initialLoad || state.result.pagination.total === 0) {
              return false;
            }

            if (typeof nextSelectedPage !== "undefined") {
              onPageChange(nextSelectedPage + 1);
            }

            return false;
          }}
          pageCount={pageCount}
          forcePage={query["page"] - 1}
        />
      </div>
    </div>
  );
};

export default Pagination;
