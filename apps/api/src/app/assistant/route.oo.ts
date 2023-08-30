import { NextRequest } from "next/server";
import * as remi from "@/remi";
import type { RemiResponse } from "@/remi";
import {
  Capability,
  Chunk,
  Filter,
  Intent,
  IntentCode,
  RealEstateQuery
} from "@rems/types";
import { RealEstateQuerySchema } from "@rems/schemas";
import { z } from "zod";
import { FilterArrayFn } from "../../remi/refine";

type MapState = z.infer<typeof RealEstateQuerySchema.MapState>;
type PageAndSort = z.infer<typeof RealEstateQuerySchema.PageAndSort>;
type SpaceRequirements = z.infer<
  typeof RealEstateQuerySchema.SpaceRequirements
>;
type BudgetAndAvailability = z.infer<
  typeof RealEstateQuerySchema.BudgetAndAvailability
>;
type ArrayKey = keyof z.infer<typeof RealEstateQuerySchema.Arrays>;

const { terse } = remi;

type Refinement =
  | { type: "LOCATION"; data: any }
  | { type: "MAP_STATE"; data: Partial<MapState> }
  | { type: "PAGE_AND_SORT"; data: Partial<PageAndSort> }
  | { type: "SPACE_REQUIREMENTS"; data: Partial<SpaceRequirements> }
  | { type: "BUDGET_AND_AVAILABILITY"; data: Partial<BudgetAndAvailability> }
  | { type: "ARRAY"; key: ArrayKey; data: Filter["slug"][] };

type Stream = (
  nl: string,
  query: RealEstateQuery
) => UnderlyingDefaultSource["start"];

const encoder = new TextEncoder();

type ArrayTask = {
  intent: IntentCode;
  key: ArrayKey;
  runner: FilterArrayFn;
};

type Tasks = {
  array: ArrayTask[];
};

type Meta = Promise<
  [RemiResponse<Intent["id"][]>, RemiResponse<Capability["id"]>]
>;

type Run =
  | { result: "NOOP" }
  | { result: "REFINEMENT"; refinement: Refinement };

class Runner {
  private meta!: Meta;
  private tasks: Tasks = { array: [] };
  private input!: string;
  private query!: RealEstateQuery;
  private runs: Promise<Run>[] = [];

  constructor() {}

  public async run(input: string, query: RealEstateQuery) {
    this.input = input;
    this.query = query;

    this.meta = Promise.all([
      remi.capability.analyze(input),
      remi.capability.identify(input)
    ]);

    const runs = this.tasks.array.map((a) => this.runArrayTask(a));
    const res = await Promise.all(runs);

    console.log(res);
  }

  private async runArrayTask(task: ArrayTask): Promise<Run> {
    const { intent } = task;

    if (terse.intents(await this.intents).includes(intent)) {
      return { result: "NOOP" };
    }

    const res = await task.runner(this.input, this.query[task.key]);

    if (!res.ok || !res.data) {
      return { result: "NOOP" };
    }

    console.log(res);

    return {
      result: "REFINEMENT",
      refinement: {
        type: "ARRAY",
        key: task.key,
        data: res.data
      }
    };
  }

  private get intents() {
    return this.meta.then(([i]) => {
      if (!i?.ok) throw new Error();
      return i.data;
    });
  }

  private get capability() {
    return this.meta.then(([_, c]) => {
      if (!c?.ok) throw new Error();
      return c.data;
    });
  }

  public async array(task: ArrayTask) {
    this.tasks.array.push(task);
  }

  // async refine(r: Refinement) {
  //   if (r.type === "ARRAY") {
  //     this.emit({ type: "PATCH", data: { [r.key]: r.data } });
  //   } else if (Object.keys(r.data).length > 0) {
  //     this.emit({ type: "PATCH", data: r.data });
  //   }
  // }
}

const stream: Stream = (input, query) => async (c) => {
  const send = (data: Chunk) => {
    const chunk = encoder.encode(`${JSON.stringify(data)}\n`);
    c.enqueue(chunk);
  };

  const runner = new Runner();

  runner.array({
    intent: "REFINE_INDOOR_FEATURES",
    key: "indoor-features",
    runner: remi.refine.indoorFeatures
  });

  runner.array({
    intent: "REFINE_OUTDOOR_FEATURES",
    key: "outdoor-features",
    runner: remi.refine.outdoorFeatures
  });

  runner.array({
    intent: "REFINE_LOT_FEATURES",
    key: "lot-features",
    runner: remi.refine.lotFeatures
  });

  runner.array({
    intent: "REFINE_PROPERTY_TYPES",
    key: "property-types",
    runner: remi.refine.propertyTypes
  });

  runner.array({
    intent: "REFINE_VIEW_TYPES",
    key: "view-types",
    runner: remi.refine.viewTypes
  });

  await runner.run(input, query);

  // console.dir(
  //   {
  //     input: nl,
  //     capability: terse.capability(capability.data),
  //     intents: terse.intents(intents.data),
  //     arrays: arrays.reduce((p, c) => {
  //       if (!c) return p;
  //       return { ...p, ...c };
  //     }, {})
  //   },
  //   { colors: true, depth: null }
  // );

  c.close();
};

export async function POST(req: NextRequest) {
  const data = await req.json();
  const query = RealEstateQuerySchema.URL.parse(data.query);

  return new Response(new ReadableStream({ start: stream(data.nl, query) }), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
