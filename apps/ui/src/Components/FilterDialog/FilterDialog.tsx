"use client";

import React, { useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import CloseIcon from "../../Elements/CloseIcon";
import css from "./FilterDialog.module.css";
import { animated, useSpring, useTransition } from "@react-spring/web";
import Split from "../../Elements/Split";
import Button from "../../Elements/Button";
import { Oval } from "react-loader-spinner";
import cn from "classnames";

type Props = React.ComponentProps<typeof Dialog.Root> & {
  loading: boolean;
  activeFilters: number;
  onClearClick: () => void;
  count?: number;
};

const Indicator = ({ amount }: { amount: number }) => {
  const $ref = useRef<HTMLDivElement>(null);

  const [style, api] = useSpring(() => ({
    width: $ref.current?.clientWidth || 0
  }));

  useEffect(() => {
    api.start({
      width: amount > 0 ? $ref.current?.offsetWidth : 0
    });
  }, [amount, $ref.current?.offsetWidth]);

  return (
    <animated.div style={style} className={css["indicator-container"]}>
      <div ref={$ref} className={css["indicator"]}>
        {amount}
      </div>
    </animated.div>
  );
};

const SidePanel = ({
  children,
  activeFilters,
  open,
  onOpenChange,
  onClearClick,
  count,
  loading,
  ...props
}: Props) => {
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
    <Dialog.Root open={open} onOpenChange={onOpenChange} {...props}>
      <Dialog.Trigger asChild>
        <a className={cn(css["control"], { [css["on"]]: activeFilters > 0 })}>
          <div className={css["icon"]}>
            <FontAwesomeIcon icon={faSliders} size="sm" />
          </div>
          Filters <Indicator amount={activeFilters} />
        </a>
      </Dialog.Trigger>
      {transitions((styles, show) =>
        show ? (
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
                style={{ x: styles.x, boxShadow: styles.boxShadow }}
              >
                <div className={css["header"]}>
                  <Dialog.Title className={css["title"]}>Filters</Dialog.Title>
                  <Dialog.Close>
                    <CloseIcon />
                  </Dialog.Close>
                </div>
                <div className={css["filters"]}>{children}</div>
                <div className={css["footer"]}>
                  <Split>
                    <Button secondary onClick={() => onClearClick()}>
                      Clear all
                    </Button>
                    <Button type="submit" onClick={() => onOpenChange?.(false)}>
                      {loading ? (
                        <Oval
                          height={22}
                          width={22}
                          color="#fff"
                          secondaryColor="#fff"
                        />
                      ) : (
                        `Show ${count} homes`
                      )}
                    </Button>
                  </Split>
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
