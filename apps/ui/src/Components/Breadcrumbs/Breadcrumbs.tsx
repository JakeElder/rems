import React from "react";
import Link from "next/link";
import css from "./Breadcrumbs.module.css";

type Item = React.ComponentProps<typeof Link>;

type Props = {
  items: Item[];
};

const Item = ({ children, href, last }: Item & { last: boolean }) => {
  if (!last) {
    return (
      <>
        <Link children={children} href={href} className={css["link"]} />
        <div className={css["separator"]}>/</div>
      </>
    );
  }

  return <span className={css["location"]}>{children}</span>;
};

const Breadcrumbs = ({ items }: Props) => {
  return (
    <div className={css["root"]}>
      {items.map((i, idx) => (
        <Item {...i} last={idx === items.length - 1} />
      ))}
    </div>
  );
};

export default Breadcrumbs;
