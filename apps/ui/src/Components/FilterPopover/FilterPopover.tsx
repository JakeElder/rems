import React from "react";
import * as Popover from "@radix-ui/react-popover";
import css from "./FilterPopover.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

type Props = {
  label: string;
  children: React.ReactNode;
};

const FilterPopover = ({ label, children }: Props) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={css["control"]}>
          {label}
          <div className={css["icon"]}>
            <FontAwesomeIcon icon={faChevronDown} size="sm" />
          </div>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={css["content"]} align="start" sideOffset={5}>
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default FilterPopover;
