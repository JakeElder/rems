import { Client } from "@googlemaps/google-maps-services-js";

export const dynamic = "force-dynamic";

const KEY = process.env.PLACES_API_KEY;
const client = new Client();

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!KEY) {
    throw new Error();
  }

  try {
    const res = await client.placePhoto({
      params: {
        key: KEY,
        photoreference: params.id,
        maxheight: 500,
      },
      responseType: "arraybuffer"
    });

    const buffer = Buffer.from(res.data, "binary");
    const headers = { "Content-Type": res.headers["content-type"] };

    return new Response(buffer, { headers });
  } catch (e) {
    return new Response(null, { status: 500 });
  }
}
