import TurndownService from "turndown";
import React from "react";
import { format, plugins } from "pretty-format";

const { ReactElement } = plugins;

TurndownService.prototype.escape = (s) => s;
var td = new TurndownService();

const md = (element: React.ReactNode) => {
  return td
    .turndown(
      format(element, {
        plugins: [ReactElement],
        printFunctionName: false,
        escapeString: false,
        escapeRegex: false
      })
    )
    .replace("\n", "");
};

export default md;
