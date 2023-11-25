import React from "react";

type Props = { height?: number };

const Monogram = ({ height = 22 }: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
      <g fill="none" fillRule="evenodd">
        <rect width={32} height={32} fill="#000" rx={3} />
        <path
          fill="#FFF"
          d="M23 7.364C22.52 7.145 22 7 21.08 7c-2.44 0-4.4 1.345-5.36 3.09V7.328H11V25h4.72v-9.018c0-2.873 1.96-4.764 4.8-4.764.92 0 1.72.146 2.48.51V7.363Z"
        />
      </g>
    </svg>
  );
};

export default Monogram;
