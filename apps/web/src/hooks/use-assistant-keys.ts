import { useEffect } from "react";

const isHTMLElement = (el: any): el is HTMLElement => el instanceof HTMLElement;

const useAssistantKeys = ({
  spaceDown,
  spaceUp,
  plus,
  minus
}: {
  spaceDown: () => void;
  spaceUp: () => void;
  plus: () => void;
  minus: () => void;
}) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (isHTMLElement(e.target) && e.target.nodeName === "INPUT") {
          return;
        }
        e.preventDefault();
        if (e.repeat) {
          return;
        }
        spaceDown();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (isHTMLElement(e.target) && e.target.nodeName === "INPUT") {
          return;
        }
        e.preventDefault();
        spaceUp();
      }
    };

    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === "+") {
        plus();
      }

      if (e.key === "-" || e.key === "_") {
        minus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keypress", onKeyPress);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keypress", onKeyPress);
    };
  }, []);
};

export default useAssistantKeys;
