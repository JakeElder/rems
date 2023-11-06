import { randomInt } from "@rems/utils";
import { Timeline } from "@rems/types";

import { factory } from "@rems/state/app";

let dates = 0;
const date = () => Date.now() + ++dates * randomInt(400, 1200);

const timeline: Timeline = [
  {
    role: "USER",
    id: "1",
    date: date(),
    event: {
      type: "YIELD",
      message: "Show me 3 bedroom properties"
    }
  },
  {
    role: "ASSISTANT",
    id: "12",
    date: date(),
    event: {
      type: "LANGUAGE_BASED",
      message: "Sure! I can do that"
    }
  },
  {
    role: "ASSISTANT",
    id: "2",
    date: date(),
    event: {
      type: "STATE_MUTATION",
      mutation: {
        prev: factory({
          realEstateQuery: {
            pageAndSort: { page: 1 }
          }
        }),
        next: factory({
          realEstateQuery: {
            pageAndSort: { page: 2 }
          }
        }),
        patch: {
          type: "SCALAR",
          group: "PAGE",
          data: { page: 2 },
          diff: [{ type: "CHANGE_SCALAR", prop: "page", value: [1, 2] }]
        }
      }
    }
  },
  {
    role: "ASSISTANT",
    id: "30",
    date: date(),
    event: {
      type: "STATE_MUTATION",
      mutation: {
        prev: factory({
          realEstateQuery: {
            indoorFeatures: [
              {
                id: 1,
                slug: "pet-friendly",
                name: "Pet Friendly"
              },
              {
                id: 2,
                slug: "swimming-pool",
                name: "Swimming Pool"
              }
            ]
          }
        }),
        next: factory({
          realEstateQuery: {
            indoorFeatures: [
              {
                id: 1,
                slug: "pet-friendly",
                name: "Pet Friendly"
              },
              {
                id: 2,
                slug: "swimming-pool",
                name: "Swimming Pool"
              }
            ]
          }
        }),
        patch: {
          group: "INDOOR_FEATURES",
          type: "ARRAY",
          prop: "Indoor Features",
          value: [
            {
              id: 1,
              slug: "pet-friendly",
              name: "Pet Friendly"
            },
            {
              id: 2,
              slug: "swimming-pool",
              name: "Swimming Pool"
            }
          ],
          diff: []
        }
      }
    }
  },
  {
    role: "ASSISTANT",
    id: "3",
    date: date(),
    event: {
      type: "STATE_MUTATION",
      mutation: {
        prev: factory({
          realEstateQuery: {
            indoorFeatures: [{ id: 1, name: "Balcony", slug: "balcony" }]
          }
        }),
        next: factory({
          realEstateQuery: {
            indoorFeatures: [
              { id: 2, name: "Swimming Pool", slug: "swimming-pool" },
              { id: 3, name: "Pet Friendly", slug: "pet-friendly" }
            ]
          }
        }),
        patch: {
          type: "ARRAY",
          prop: "Indoor Features",
          group: "INDOOR_FEATURES",
          value: [
            { id: 2, name: "Swimming Pool", slug: "swimming-pool" },
            { id: 3, name: "Pet Friendly", slug: "pet-friendly" }
          ],
          diff: [
            {
              type: "REMOVE_FROM_ARRAY",
              value: { id: 1, name: "Balcony", slug: "balcony" }
            },
            {
              type: "ADD_TO_ARRAY",
              value: { id: 2, name: "Swimming Pool", slug: "swimming-pool" }
            },
            {
              type: "ADD_TO_ARRAY",
              value: { id: 3, name: "Pet Friendly", slug: "pet-friendly" }
            }
          ]
        }
      }
    }
  },
  {
    role: "ASSISTANT",
    id: "50",
    date: date(),
    event: {
      type: "STATE_MUTATION",
      mutation: {
        prev: factory({
          realEstateQuery: {
            space: {
              minBedrooms: 3,
              maxBedrooms: 4
            }
          }
        }),
        next: factory({
          realEstateQuery: {
            space: {
              minBedrooms: 3,
              maxBedrooms: 4
            }
          }
        }),
        patch: {
          type: "SCALAR",
          group: "SPACE_REQUIREMENTS",
          data: {
            "min-bedrooms": 3,
            "max-bedrooms": 4
          },
          diff: []
        }
      }
    }
  },
  {
    role: "ASSISTANT",
    id: "5",
    date: date(),
    event: {
      type: "STATE_MUTATION",
      mutation: {
        prev: factory({
          realEstateQuery: {
            space: {
              minBedrooms: 2,
              maxBedrooms: 3
            }
          }
        }),
        next: factory({
          realEstateQuery: {
            space: {
              minBedrooms: 3,
              minLotSize: 100
            }
          }
        }),
        patch: {
          type: "SCALAR",
          group: "SPACE_REQUIREMENTS",
          data: { "min-bedrooms": 3 },
          diff: [
            {
              type: "CHANGE_SCALAR",
              prop: "min-bedrooms",
              value: [2, 3]
            },
            {
              type: "REMOVE_SCALAR",
              prop: "max-bedrooms",
              value: 3
            },
            {
              type: "ADD_SCALAR",
              prop: "min-lot-size",
              value: 100
            }
          ]
        }
      }
    }
  },
  {
    role: "ASSISTANT",
    id: "6",
    date: date(),
    event: {
      type: "YIELD",
      message:
        "Ok, I’ve set the min bedrooms to 3. Is there anything else you’d like me to do?"
    }
  }
];

export default timeline;
