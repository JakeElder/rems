import {
  AnalysisAssistantMessage,
  ArrayPatch,
  AssistantMessage,
  PatchReaction,
  ScalarPatch
} from "@rems/types";
import { createStream, WritableStream } from "table";
import ms from "pretty-ms";
import chalk from "chalk";

export const init = (input: string) => {
  const t = Date.now();
  let stream: WritableStream | null = null;

  const i = (analysis: AnalysisAssistantMessage) => {
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
      i(message);

      if (!stream) throw new Error();

      stream.write([now(), heading("Input"), val(input)]);
      stream.write([now(), heading("Capability"), val(message.capability)]);
      stream.write([
        now(),
        heading("Intents"),
        val(message.intents.join(", "))
      ]);
    }

    if (!stream) throw new Error();

    if (message.type === "REACTION" && message.reaction.type === "PATCH") {
      stream.write([
        now(),
        heading(message.reaction.group),
        diff(message.reaction)
      ]);
    }
  };
};

const arrayDiff = (patch: ArrayPatch) => {
  if (patch.diff.length === 0) {
    return chalk.gray(JSON.stringify(patch.value));
  }

  return patch.diff
    .map((p) => {
      if (p.type === "ADD_ARRAY") {
        return chalk.green(`+ ${p.value}`);
      }

      if (p.type === "REMOVE_ARRAY") {
        return chalk.red(`- ${p.value}`);
      }
    })
    .join("\n");
};

const scalarDiff = (patch: ScalarPatch) => {
  if (patch.diff.length === 0) {
    return chalk.gray(JSON.stringify(patch.data));
  }

  return patch.diff
    .map((p) => {
      if (p.type === "ADD_SCALAR") {
        return chalk.green(`+ ${p.k}: ${p.value}`);
      }

      if (p.type === "REMOVE_SCALAR") {
        return chalk.red(`- ${p.k}: ${p.value}`);
      }

      if (p.type === "CHANGE_SCALAR") {
        return chalk.yellow(`⇄ ${p.k}: ${p.value[0]} => ${p.value[1]}`);
      }
    })
    .join("\n");
};

const diff = ({ patch }: PatchReaction) =>
  patch.type === "ARRAY" ? arrayDiff(patch) : scalarDiff(patch);
