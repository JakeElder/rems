"use client";

import React from "react";
import * as Popover from "@radix-ui/react-popover";
import css from "./FilterPopover.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { inter } from "../../Utils/FontLoader";
import cn from "classnames";

type Props = {
  label: string;
  children: React.ReactNode;
  on?: boolean;
};

const FilterPopover = ({ label, children, on }: Props) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={cn(css["control"], { [css["on"]]: on })}>
          {label}
          <div className={css["icon"]}>
            <FontAwesomeIcon icon={faChevronDown} size="sm" />
          </div>
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
