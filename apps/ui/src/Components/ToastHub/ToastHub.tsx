import React, { useState, useMemo, createContext, useContext } from "react";
import { animated, useTransition } from "@react-spring/web";
import css from "./ToastHub.module.css";
import Toast from "src/Elements/Toast/Toast";

let id = 0;

type Props = {
  children: React.ReactNode;
};

type ToastData = {
  title?: string;
  message: string;
  timeout?: number;
};

type Item = {
  key: number;
  data: ToastData;
};

type UseToastReturn = {
  message: (params: ToastData) => void;
};

const ToastContext = createContext<UseToastReturn | null>(null);

export const useToast = () => {
  const fns = useContext(ToastContext);
  if (fns === null) {
    throw new Error();
  }
  return fns;
};

export default function MessageHub({ children }: Props) {
  const refMap = useMemo(() => new WeakMap(), []);
  const [items, setItems] = useState<Item[]>([]);

  const message: UseToastReturn["message"] = (data) => {
    const item: Key = { key: id++, data };
    setItems((state) => [...state, item]);
    if (data.timeout) {
      setTimeout(() => close(item), data.timeout);
    }
  };

  const close = (item: Item) => {
    setItems((state) =>
      state.filter((i) => {
        return i.key !== item.key;
      })
    );
  };

  const transitions = useTransition(items, {
    from: { height: 0 },
    keys: (item) => item.key,
    enter: (item) => async (next) => {
      await next({ height: refMap.get(item).offsetHeight + 10 });
    },
    leave: { height: 0 }
  });

  return (
    <div className={css["root"]}>
      <div className={css["toasts"]}>
        {transitions(({ ...style }, item) => (
          <animated.div className={css["message"]} style={style}>
            <div
              className={css["toast"]}
              ref={(ref) => ref && refMap.set(item, ref)}
            >
              <Toast title={item.data.title} handleClose={() => close(item)}>
                {item.data.message}
              </Toast>
            </div>
          </animated.div>
        ))}
      </div>
      <ToastContext.Provider value={{ message }}>
        {children}
      </ToastContext.Provider>
    </div>
  );
}
