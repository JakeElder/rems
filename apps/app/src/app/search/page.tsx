import nlToQuery from "../../utils/nl-to-query";
// import queryToNl from "../../utils/query-to-nl";

export default async function Home() {
  const response = await nlToQuery(
    "Lookingn for a rental place to live. Bbudget between 10k and 30k per month. Preferablby a condo but apartment is fine"
  );

  // const response = await queryToNl({
  //   "property-type": ["apartment", "condo"],
  //   "min-bedrooms": 3,
  //   "max-bedrooms": 3,
  //   "indoor-features": ["cinema"],
  //   "outdoor-features": ["pool"],
  //   "view-types": [
  //     "panoramic-scenic-view",
  //     "water-view",
  //     "ocean-view",
  //     "sea-view",
  //     "lake-view",
  //     "river-view",
  //     "mountain-view"
  //   ],
  //   "max-living-area": 150
  // });

  return (
    <div style={{ padding: 30 }}>
      <pre style={{ background: "#444", color: "#ccc", padding: 20 }}>
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
}
