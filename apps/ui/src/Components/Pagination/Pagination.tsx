"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft
} from "@fortawesome/free-solid-svg-icons";
import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";
import Link from "next/link";

type Props = {
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  createLink: (page: number) => string;
  total?: number;
  pageSize?: number;
};

const Pagination = ({
  loading,
  total,
  pageSize,
  currentPage,
  onPageChange,
  createLink
}: Props) => {
  if (!total) {
    return null;
  }

  const pageCount = total ? Math.ceil(total! / pageSize!) : 1;

  return (
    <div className={css["root"]}>
      <div className={css["next"]}>
        {pageCount > currentPage ? (
          <Link
            className={css["button"]}
            children="Next"
            href={createLink(currentPage + 1)}
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
          hrefBuilder={(page) => createLink(page)}
          onClick={({ nextSelectedPage, event }) => {
            (event as any).preventDefault();

            if (loading || total === 0) {
              return false;
            }

            if (typeof nextSelectedPage !== "undefined") {
              onPageChange(nextSelectedPage + 1);
            }

            return false;
          }}
          pageCount={pageCount}
          forcePage={currentPage - 1}
        />
      </div>
    </div>
  );
};

export default Pagination;
