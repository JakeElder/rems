import { z } from "zod";
import InputSchema from "./input";
import { PageAndSort } from "../real-estate-query";

export const ArgsSchema = z.tuple([InputSchema, PageAndSort]);

export const ReturnsSchema = z
  .object({
    p: PageAndSort.shape["page"],
    s: PageAndSort.shape["sort"]
  })
  .partial()
  .transform(({ p, s }) => ({
    page: p,
    sort: s
  }));
