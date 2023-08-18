import TurndownService from "turndown";

TurndownService.prototype.escape = (s) => s;
const td = new TurndownService();

const txt = (node: React.ReactNode) => {
  const { renderToStaticMarkup } = require("react-dom/server");
  return td.turndown(renderToStaticMarkup(node));
};

export default txt;
