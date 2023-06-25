import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import CloseIcon from "../../Elements/CloseIcon";
import css from "./FilterDialog.module.css";
import { animated, useTransition } from "@react-spring/web";

type Props = {};

const SidePanel = ({}: Props) => {
  const [open, setOpen] = useState(false);

  const transitions = useTransition(open, {
    from: {
      opacity: 0,
      x: "-100%",
      boxShadow: "0 0 17px -6px rgba(0, 0, 0, 0)"
    },
    enter: {
      opacity: 0.4,
      x: "0%",
      boxShadow: "0 0 17px -6px rgba(0, 0, 0, 0.5)"
    },
    leave: {
      opacity: 0,
      x: "-100%",
      boxShadow: "0 0 17px -6px rgba(0, 0, 0, 0)"
    }
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <a className={css["control"]}>
          <div className={css["icon"]}>
            <FontAwesomeIcon icon={faSliders} size="sm" />
          </div>
          Filters
        </a>
      </Dialog.Trigger>
      {transitions((styles, item) =>
        item ? (
          <>
            <Dialog.Overlay forceMount asChild>
              <animated.div
                style={{ opacity: styles.opacity }}
                className={css["overlay"]}
              />
            </Dialog.Overlay>
            <Dialog.Content forceMount asChild>
              <animated.div
                className={css["content"]}
                style={{
                  x: styles.x,
                  boxShadow: styles.boxShadow
                }}
              >
                <div className={css["header"]}>
                  <Dialog.Title className={css["title"]}>Filters</Dialog.Title>
                  <Dialog.Close>
                    <CloseIcon />
                  </Dialog.Close>
                </div>
                <div className={css["filters"]}></div>
                <div className={css["footer"]}>
                  <button>Clear all</button>
                  <button>Show</button>
                </div>
              </animated.div>
            </Dialog.Content>
          </>
        ) : null
      )}
      <Dialog.Portal></Dialog.Portal>
    </Dialog.Root>
  );
};

export default SidePanel;
