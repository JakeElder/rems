import { realEstateQueryStore } from "../src/stores";

test("req", () => {
  const { initial, update } = realEstateQueryStore({
    lotFeatures: [{ id: 1, name: "1", slug: "1" }],
    pageAndSort: { page: 3 },
    locationSource: { description: "Not Bangkok" }
  });

  // const one = update("lotFeatures", []);

  // console.dir(one, { depth: null, colors: true });

  // const two = update("propertyTypes", [{ id: 2, name: "2", slug: "2" }]);

  // console.dir(two, { depth: null, colors: true });

  const three = update("locationSource", {
    description: "Somewhere else"
  });

  console.dir(three, { depth: null, colors: true });
});
