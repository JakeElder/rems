"use client";

import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import css from "./FilterPopover.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { inter } from "../../Utils/FontLoader";
import cn from "classnames";
import Outline from "../../Elements/Outline";

type Props = {
  label: string;
  children: React.ReactNode;
  on?: boolean;
};

const FilterPopover = ({ label, children, on }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root onOpenChange={setOpen} open={open}>
      <Popover.Trigger asChild>
        <button className={css["control"]}>
          <Outline on={open || on}>
            <div className={css["control-inner"]}>
              {label}
              <div className={css["icon"]}>
                <FontAwesomeIcon icon={faChevronDown} size="sm" />
              </div>
            </div>
          </Outline>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={cn(css["content"], inter.className)}
          align="start"
          sideOffset={15}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default FilterPopover;
