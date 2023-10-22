import { realEstateQueryStore } from "../src/stores";

test("req", () => {
  const { initial, update } = realEstateQueryStore({
    lotFeatures: [{ id: 1, name: "1", slug: "1" }],
    pageAndSort: { page: 3 }
  });

  const one = update("lotFeatures", []);

  console.dir(one, { depth: null, colors: true });

  // const two = update("propertyTypes", [
  //   { id: 1, name: "1", slug: "1" },
  //   { id: 2, name: "2", slug: "2" }
  // ]);

  // console.dir(two, { depth: null, colors: true });
});
