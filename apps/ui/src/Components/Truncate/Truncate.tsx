"use client";

import React, { useState } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import css from "./Truncate.module.css";

type Props = {
  copy: string;
  chars?: number;
};

const Split = ({
  children,
  process = (p) => <>{p}</>
}: {
  children: string;
  process?: (p: string, ps: string[], i: number) => React.ReactNode;
}) => {
  const ps = children.split(/\n+/);
  return (
    <>
      {ps.map((p, idx) => (
        <p key={`p${idx}`}>{process(p, ps, idx)}</p>
      ))}
    </>
  );
};

const Truncate = ({ copy, chars = 400 }: Props) => {
  const [open, setOpen] = useState(false);
  const [shown, truncated] = [copy.substring(0, chars), copy.substring(chars)];

  if (!truncated.length) {
    return <Split>{copy}</Split>;
  }

  if (open) {
    return (
      <>
        <Split>{copy}</Split>
        <span className={css["read-less"]} onClick={() => setOpen(false)}>
          read less
        </span>
      </>
    );
  }

  return (
    <>
      <Split
        process={(p, ps, i) => {
          if (i === ps.length - 1) {
            return (
              <>
                {p}
                <span className={css["ellipsis"]}>…</span>
                <span
                  className={css["read-more"]}
                  onClick={() => setOpen(true)}
                >
                  read more
                </span>
              </>
            );
          }
          return <>{p}</>;
        }}
      >
        {shown}
      </Split>
      <VisuallyHidden.Root>
        <Split>{truncated}</Split>
      </VisuallyHidden.Root>
    </>
  );
};

export default Truncate;
