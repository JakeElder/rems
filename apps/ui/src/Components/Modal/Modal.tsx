import React from "react";
import css from "./Modal.module.css";
import { useTransition, animated } from "@react-spring/web";
import useEscapeKey from "../../lib/use-escape-key";

type Props = {
  open: boolean;
  onCloseRequest: () => void;
  children: React.ReactNode;
};

const Modal = ({ open, children, onCloseRequest }: Props) => {
  const transition = useTransition(open, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: open
  });

  useEscapeKey(onCloseRequest);

  return transition(
    (styles, item) =>
      item && (
        <animated.div className={css["root"]} style={styles}>
          {children}
        </animated.div>
      )
  );
};

export default Modal;
