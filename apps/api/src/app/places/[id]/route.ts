import { NextResponse } from "next/server";
import qs from "qs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const q = qs.stringify({
    place_id: params.id,
    key: process.env.PLACES_API_KEY,
    fields: "geometry,name"
  });

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${q}`
  );

  const { result } = await res.json();

  return NextResponse.json({
    id: params.id,
    label: result.name,
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng
  });
}
