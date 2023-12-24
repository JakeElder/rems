// import { Client } from "@googlemaps/google-maps-services-js";
import {
  Bounds,
  LocationResolution,
  LocationSource,
  NlLocationSource
} from "@rems/types";
import { google } from "googleapis";
import memoize from "memoizee";

// const client = new Client();
const key = process.env.PLACES_API_KEY;

const { places } = google.places({
  version: "v1",
  auth: process.env.PLACES_API_KEY
});

if (!key) {
  throw new Error();
}

type ResolveLocationSourceReturn =
  | { ok: true; resolution: LocationResolution }
  | { ok: false };

const adjustBoundsToMinimumArea = (
  viewport: Bounds,
  minAreaKm2: number = 40
) => {
  const EARTH_CIRCUMFERENCE = 40075;
  const KM_PER_DEGREE_LAT = EARTH_CIRCUMFERENCE / 360;

  const low = viewport.sw;
  const high = viewport.ne;

  const latDiff = high.lat - low.lat;
  const avgLat = (high.lat + low.lat) / 2;
  const lngDiff = high.lng - low.lng;
  const area =
    latDiff *
    lngDiff *
    KM_PER_DEGREE_LAT *
    KM_PER_DEGREE_LAT *
    Math.cos((avgLat * Math.PI) / 180);

  if (area < minAreaKm2) {
    const requiredLatDiff = Math.sqrt(
      minAreaKm2 /
        (KM_PER_DEGREE_LAT *
          KM_PER_DEGREE_LAT *
          Math.cos((avgLat * Math.PI) / 180))
    );
    const requiredLngDiff =
      requiredLatDiff / Math.cos((avgLat * Math.PI) / 180);

    return {
      sw: {
        lat: avgLat - requiredLatDiff / 2,
        lng: (high.lng + low.lng) / 2 - requiredLngDiff / 2
      },
      ne: {
        lat: avgLat + requiredLatDiff / 2,
        lng: (high.lng + low.lng) / 2 + requiredLngDiff / 2
      }
    };
  }

  return viewport;
};

const resolveNlLocationSource = memoize(
  async (source: NlLocationSource): Promise<ResolveLocationSourceReturn> => {
    const r = await places.searchText({
      requestBody: { textQuery: source.description },
      fields: ["displayName", "editorialSummary", "location", "viewport", "id"]
        .map((l) => `places.${l}`)
        .join(",")
    });

    if (!r.data.places) {
      return { ok: false };
    }

    const place = r.data.places[0];
    const { id, location, viewport, displayName, editorialSummary } = place;

    if (
      !id ||
      !location ||
      !location.latitude ||
      !location.longitude ||
      !viewport ||
      !viewport.low ||
      !viewport.high ||
      !viewport.low.longitude ||
      !viewport.low.latitude ||
      !viewport.high.latitude ||
      !viewport.high.longitude
    ) {
      return { ok: false };
    }

    const bounds: Bounds = {
      sw: { lat: viewport.low.latitude, lng: viewport.low.longitude },
      ne: { lat: viewport.high.latitude, lng: viewport.high.longitude }
    };

    const adjusted = adjustBoundsToMinimumArea(bounds);

    const resolution: LocationResolution = {
      id,
      lat: location.latitude,
      lng: location.longitude,
      bounds: adjusted,
      ...(displayName?.text ? { displayName: displayName.text } : {}),
      ...(editorialSummary?.text
        ? { editorialSummary: editorialSummary?.text }
        : {})
    };

    return { ok: true, resolution };
  },
  { normalizer: ([source]) => `${source.description}` }
);

const resolveLocationSource = async (
  ls: LocationSource
): Promise<ResolveLocationSourceReturn> => {
  if (ls.type === "NL") {
    return resolveNlLocationSource(ls);
  }
  return { ok: false };
};

export const resolveLocationSourceOrFail = async (
  ls: LocationSource
): Promise<LocationResolution> => {
  if (ls.type === "NL") {
    const res = await resolveNlLocationSource(ls);
    if (res.ok) {
      return res.resolution;
    }
  }
  throw new Error();
};

// const r = await client.textSearch({
//   params: { query: location, key }
// });

export default resolveLocationSource;
