import TurndownService from "turndown";
import React from "react";
import { format, plugins } from "pretty-format";

const { ReactElement } = plugins;

var td = new TurndownService();

const md = (element: React.ReactNode) => {
  return td.turndown(
    format(element, {
      plugins: [ReactElement],
      printFunctionName: false
    })
  );
};

export default md;
