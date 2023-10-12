import { useEffect } from "react";

const isHTMLElement = (el: any): el is HTMLElement => el instanceof HTMLElement;

const useAssistantKeys = ({
  spaceDown,
  spaceUp,
  plus,
  minus,
  escape,
  leftBrace,
  rightBrace
}: {
  spaceDown: () => void;
  spaceUp: () => void;
  plus: () => void;
  minus: () => void;
  escape: () => void;
  leftBrace: () => void;
  rightBrace: () => void;
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
      if (e.code === "Escape") {
        escape();
      }
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

      if (e.key === "{") {
        leftBrace();
      }

      if (e.key === "}") {
        rightBrace();
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
