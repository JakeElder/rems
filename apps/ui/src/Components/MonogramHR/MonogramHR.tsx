import React from "react";
import css from "./MonogramHR.module.css";

type Props = {};

const MonogramHR = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <span className={css["hr"]} />
      <div className={css["monogram"]}>
        <svg xmlns="http://www.w3.org/2000/svg" width={75} height={75}>
          <g fill="none" fillRule="evenodd">
            <rect width={75} height={75} fill="#ddd" rx={5} />
            <path
              fill="#FFF"
              d="M53.906 17.259c-1.125-.512-2.343-.853-4.5-.853-5.718 0-10.312 3.154-12.562 7.245v-6.478H25.78v41.42h11.063V37.458c0-6.733 4.593-11.164 11.25-11.164 2.156 0 4.031.34 5.812 1.193V17.259Z"
            />
          </g>
        </svg>
      </div>
      <span className={css["hr"]} />
    </div>
  );
};

export default MonogramHR;
