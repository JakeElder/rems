import { fromSearchParams } from "../src/query";

test("does stuff", () => {
  const query = fromSearchParams(
    {
      "indoor-features": "bar,cinema",
      page: "5",
      sort: "lowest-price-first",
      "max-price": "banana"
    },
    {
      indoorFeatures: [
        { id: 1, name: "Bar", slug: "bar" },
        { id: 2, name: "Cinema", slug: "cinema" }
      ],
      viewTypes: [],
      lotFeatures: [],
      propertyTypes: [],
      outdoorFeatures: []
    }
  );

  expect(query.indoorFeatures[0].name).toBe("Bar");
});
