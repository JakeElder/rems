import { z } from "zod";
import NlInputSchema from "../nl-input";
import { MapState } from "../real-estate-query";

export const ArgsSchema = z.tuple([NlInputSchema, MapState]);

export const ContextSchema = z.object({
  input: NlInputSchema,
  current: MapState
});

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
