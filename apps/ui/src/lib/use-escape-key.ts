import { useHotkeys } from "react-hotkeys-hook";

type HotKeyParams = Parameters<typeof useHotkeys>;

function useEscapeKey<T extends HTMLElement>(
  callback: HotKeyParams[1],
  deps: HotKeyParams[3] = []
) {
  useHotkeys<T>("escape", callback, deps);
}

export default useEscapeKey;
