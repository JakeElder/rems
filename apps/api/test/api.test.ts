import { getTravelDetails } from "../src/utils";

test("getTravelDetails", async () => {
  const details = await getTravelDetails(
    { lat: 13.7246006, lng: 100.4801026 },
    "Lumpini Park, Bangkok, Thailand"
  );
  console.dir(details, { colors: true, depth: null });
});
