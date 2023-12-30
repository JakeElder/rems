// import { Client } from "@googlemaps/google-ma{ lat, lng}-services-js";
import {
  Bounds,
  LatLng,
  LocationResolution,
  LocationSource,
  NlLocationSource
} from "@rems/types";
import { google, places_v1 } from "googleapis";
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
  minAreaKm2: number = 80
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

const boundsFromPointAndRadius = ({ lat, lng }: LatLng, radiusKm: number) => {
  const EARTH_CIRCUMFERENCE = 40075;
  const KM_PER_DEGREE_LAT = EARTH_CIRCUMFERENCE / 360;

  const radiusLat = radiusKm / KM_PER_DEGREE_LAT;
  const radiusLng =
    radiusKm / (KM_PER_DEGREE_LAT * Math.cos((lat * Math.PI) / 180));

  return {
    sw: {
      lat: lat - radiusLat,
      lng: lng - radiusLng
    },
    ne: {
      lat: lat + radiusLat,
      lng: lng + radiusLng
    }
  };
};

const areas = [
  "locality",
  "administrative_area_level_1",
  "country",
  "administrative_area_level_2",
  "administrative_area_level_3",
  "administrative_area_level_4",
  "administrative_area_level_5",
  "administrative_area_level_6",
  "administrative_area_level_7",
  "colloquial_area",
  "continent",
  "neighborhood",
  "sublocality",
  "sublocality_level_1",
  "sublocality_level_2",
  "sublocality_level_3",
  "sublocality_level_4",
  "sublocality_level_5"
];

const typesToType = (
  types: places_v1.Schema$GoogleMapsPlacesV1Place["types"]
): LocationResolution["type"] => {
  if (!types) return "AREA";
  if (types.some((t) => areas.includes(t))) return "AREA";
  return "POINT";
};

const resolveNlLocationSource = async (
  source: NlLocationSource
): Promise<ResolveLocationSourceReturn> => {
  const r = await places.searchText({
    requestBody: { textQuery: source.description },
    fields: [
      "displayName",
      "editorialSummary",
      "location",
      "viewport",
      "id",
      "types"
    ]
      .map((l) => `places.${l}`)
      .join(",")
  });

  if (!r.data.places) {
    return { ok: false };
  }

  const { id, location, viewport, displayName, editorialSummary, types } =
    r.data.places[0];

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

  const type = typesToType(types);

  const bounds: Bounds = {
    sw: { lat: viewport.low.latitude, lng: viewport.low.longitude },
    ne: { lat: viewport.high.latitude, lng: viewport.high.longitude }
  };

  const adjusted =
    type === "POINT"
      ? boundsFromPointAndRadius(
          { lat: location.latitude, lng: location.longitude },
          (source.radius + 8000) / 1000
        )
      : adjustBoundsToMinimumArea(bounds);

  const resolution: LocationResolution = {
    id,
    lat: location.latitude,
    lng: location.longitude,
    bounds: adjusted,
    ...(displayName?.text ? { displayName: displayName.text } : {}),
    ...(editorialSummary?.text
      ? { editorialSummary: editorialSummary?.text }
      : {}),
    type
  };

  return { ok: true, resolution };
};
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
