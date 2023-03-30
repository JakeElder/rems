import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const StoryPad = ({ children }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        width: "calc(100% - 40px)",
        height: "calc(100% - 40px)",
        left: 20,
        top: 20,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch"
      }}
    >
      {children}
    </div>
  );
};

export default StoryPad;
