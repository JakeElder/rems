import { z } from "zod";
import { MapState } from "../real-estate-query";
import { TimelineSchema } from "../timeline";

export const ContextSchema = z.object({
  timeline: TimelineSchema,
  current: MapState
});

export const ArgsSchema = ContextSchema;

export const ReturnsSchema = z
  .object({
    r: MapState.shape["radius"],
    re: MapState.shape["radius-enabled"],
    z: MapState.shape["zoom"],
    lat: MapState.shape["lat"],
    lng: MapState.shape["lng"]
  })
  .partial()
  .transform(({ r, re, z, lat, lng }) => ({
    radius: r,
    "radius-enabled": re,
    zoom: z,
    lat,
    lng
  }));
