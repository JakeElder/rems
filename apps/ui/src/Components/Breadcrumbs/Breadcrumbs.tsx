import React from "react";
import Link from "next/link";
import css from "./Breadcrumbs.module.css";

type Props = {};

const Breadcrumbs = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <Link href="/">Home</Link>
      <div className={css["separator"]}>/</div>
      <span className={css["location"]}>Real Estate</span>
    </div>
  );
};

export default Breadcrumbs;
