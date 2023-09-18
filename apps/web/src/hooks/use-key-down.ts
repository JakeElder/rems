import { useEffect } from "react";

const isHTMLElement = (el: any): el is HTMLElement => el instanceof HTMLElement;

const useKeyDown = ({
  code,
  down,
  up
}: {
  code: KeyboardEvent["code"];
  down: () => void;
  up: () => void;
}) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === code) {
        if (isHTMLElement(e.target) && e.target.nodeName === "INPUT") {
          return;
        }
        e.preventDefault();
        if (e.repeat) {
          return;
        }
        down();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === code) {
        if (isHTMLElement(e.target) && e.target.nodeName === "INPUT") {
          return;
        }
        e.preventDefault();
        up();
      }
    };

    console.log("binding");
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);
};

export default useKeyDown;
