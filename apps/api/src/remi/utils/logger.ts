import {
  AnalysisAssistantMessage,
  AssistantMessage,
  PatchArrayReaction,
  PatchScalarReaction,
  ScalarKey
} from "@rems/types";
import { createStream, WritableStream } from "table";
import ms from "pretty-ms";
import chalk from "chalk";

export const init = (input: string) => {
  const t = Date.now();
  let stream: WritableStream | null = null;

  const i = (analysis: AnalysisAssistantMessage["data"]) => {
    const headings = [
      ...analysis.intents.map((s) => s.replace("REFINE_", "")),
      "Input",
      "Intents",
      "Capability"
    ];
    const headingWidth = Math.max(...headings.map((s) => s.length));

    stream = createStream({
      columnDefault: { width: 20 },
      columnCount: 3,
      columns: [
        { width: 6, alignment: "center" },
        { width: headingWidth },
        { width: 150 - (8 + headingWidth) }
      ]
    });
  };

  const now = () => chalk.gray(ms(Date.now() - t));
  const heading = (s: string) =>
    chalk.yellow(chalk.bold(s.replace("REFINE_", "")));
  const val = (s: string) => chalk.cyan(s);

  return (message: AssistantMessage) => {
    if (message.type === "ANALYSIS") {
      i(message.data);

      if (!stream) throw new Error();

      stream.write([now(), heading("Input"), val(input)]);
      stream.write([
        now(),
        heading("Capability"),
        val(message.data.capability)
      ]);
      stream.write([
        now(),
        heading("Intents"),
        val(message.data.intents.join(", "))
      ]);
    }

    if (!stream) throw new Error();

    if (message.type === "REACTION") {
      stream.write([now(), heading(message.intent), diff(message.reaction)]);
    }
  };
};

const arrayDiff = (reaction: PatchArrayReaction) => {
  if (reaction.diff.length === 0) {
    return chalk.gray(JSON.stringify(reaction.value));
  }

  return reaction.diff
    .map((p) => {
      if (p.type === "ADD_ARRAY") {
        return chalk.green(`+ ${JSON.stringify(p.values)}`);
      }

      if (p.type === "REMOVE_ARRAY") {
        return chalk.red(`- ${JSON.stringify(p.values)}`);
      }
    })
    .join("\n");
};

const scalarDiff = (reaction: PatchScalarReaction) => {
  if (reaction.diff.length === 0) {
    return chalk.gray(JSON.stringify(reaction.patch));
  }

  return reaction.diff
    .map((p) => {
      if (p.type === "ADD_SCALAR") {
        const keys = Object.keys(p.props) as ScalarKey[];
        const props = keys.map((k) => `+ ${k}: ${p.props[k]}`);
        return chalk.green(props.join("\n"));
      }

      if (p.type === "REMOVE_SCALAR") {
        const keys = Object.keys(p.props) as ScalarKey[];
        const props = keys.map((k) => `- ${k}: ${p.props[k]}`);
        return chalk.red(props.join("\n"));
      }

      if (p.type === "CHANGE_SCALAR") {
        const keys = Object.keys(p.props) as ScalarKey[];
        const props = keys.map(
          (k) => `⇄ ${k}: ${p.props[k][0]} => ${p.props[k][1]}`
        );
        return chalk.yellow(props.join("\n"));
      }
    })
    .join("\n");
};

const diff = (reaction: PatchArrayReaction | PatchScalarReaction) =>
  reaction.type === "PATCH_ARRAY" ? arrayDiff(reaction) : scalarDiff(reaction);
