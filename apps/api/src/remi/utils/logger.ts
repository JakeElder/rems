import {
  ArrayPatch,
  AssistantEvent,
  Patch,
  ScalarPatch,
  SystemEvent,
  Timeline
} from "@rems/types";
import { TableUserConfig, table } from "table";
import ms from "pretty-ms";
import chalk from "chalk";
import timelineToInput from "../utils/timeline-to-input";

const now = (start: number) => chalk.gray(ms(Date.now() - start));
const heading = (s: string) =>
  chalk.yellow(chalk.bold(s.replace("REFINE_", "")));
const val = (s: string) => chalk.cyan(s);

export const init = (timeline: Timeline) => {
  const t = Date.now();
  let headingWidth: number;
  let tableConfig: TableUserConfig;

  return (e: AssistantEvent | SystemEvent) => {
    if (e.type === "ANALYSIS_PERFORMED") {
      const { analysis } = e;

      const headings = [
        ...analysis.intents.map((s) => s.replace("REFINE_", "")),
        "Input",
        "Intents",
        "Capability"
      ];

      headingWidth = Math.max(...headings.map((s) => s.length));
      tableConfig = {
        columnDefault: { width: 20 },
        columns: [
          { width: 6, alignment: "center" },
          { width: headingWidth },
          { width: 150 - (8 + headingWidth) }
        ]
      };

      console.log(
        table(
          [
            [now(t), heading("Input"), val(timelineToInput(timeline))],
            [now(t), heading("Capability"), val(analysis.capability)],
            [now(t), heading("Intents"), val(analysis.intents.join(", "))]
          ],
          tableConfig
        )
      );
    }

    if (e.type === "PATCH") {
      console.log(
        table([[now(t), heading(e.patch.group), diff(e.patch)]], tableConfig)
      );
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

const diff = (patch: Patch) =>
  patch.type === "ARRAY" ? arrayDiff(patch) : scalarDiff(patch);
