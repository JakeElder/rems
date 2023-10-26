import { Client } from "@googlemaps/google-maps-services-js";
import {
  LocationResolution,
  LocationSource,
  NlLocationSource
} from "@rems/types";
import { google } from "googleapis";
import memoize from "memoizee";

const client = new Client();
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

    const resolution: LocationResolution = {
      id,
      lat: location.latitude,
      lng: location.longitude,
      bounds: {
        sw: { lat: viewport.low.latitude, lng: viewport.low.longitude },
        ne: { lat: viewport.high.latitude, lng: viewport.high.longitude }
      },
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

// const r = await client.textSearch({
//   params: { query: location, key }
// });

export default resolveLocationSource;
