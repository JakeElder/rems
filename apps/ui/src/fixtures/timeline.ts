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
      message: "Show me 3 bedroom properties",
      state: factory()
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
    role: "SYSTEM",
    id: "28",
    date: date(),
    event: {
      type: "NEARBY_PLACES_ESTABLISHED",
      result: {
        keyword: "Schools",
        location: { lat: 18.788878, lng: 98.997026 },
        places: [
          {
            business_status: "OPERATIONAL",
            geometry: {
              location: { lat: 13.7163164, lng: 100.6021626 },
              viewport: {
                northeast: { lat: 13.71772747989272, lng: 100.6035530798927 },
                southwest: { lat: 13.71502782010728, lng: 100.6008534201073 }
              }
            },
            icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/school-71.png",
            icon_background_color: "#7B9EB0",
            icon_mask_base_uri:
              "https://maps.gstatic.com/mapfiles/place_api/icons/v2/school_pinlet",
            name: "Bangkok Prep Primary International School",
            opening_hours: { open_now: false },
            photos: [
              {
                height: 4624,
                html_attributions: [
                  '<a href="https://maps.google.com/maps/contrib/111825030367259220730">Sa Aa</a>'
                ],
                photo_reference:
                  "AWU5eFgjMQUAriU2v0yS0jOnmrSVynP7gcmoLUrwTA1KPiFi9Qyk53f3M9e6DBUsOR3E3Vnb2AzfNaInP74GwgtDs2YZM8xZhfAgcZ_ce8i0xOxO2t4AIJBbXVLIrpNN-2vmOEBAld_4oD67xD89YdAI9d92BBbiEMHEQdAUQ6nPz_bEO_fj",
                width: 3468
              }
            ],
            place_id: "ChIJR31p0hqf4jARn9EgSohNTAA",
            plus_code: {
              compound_code: "PJ82+GV Bangkok",
              global_code: "7P52PJ82+GV"
            },
            rating: 5,
            reference: "ChIJR31p0hqf4jARn9EgSohNTAA",
            scope: "GOOGLE",
            types: [
              "primary_school",
              "school",
              "point_of_interest",
              "establishment"
            ],
            user_ratings_total: 3,
            vicinity: "55 Habito Rd, Phra Khanong Nuea, Watthana"
          },
          {
            business_status: "OPERATIONAL",
            geometry: {
              location: { lat: 13.7151703, lng: 100.5460071 },
              viewport: {
                northeast: { lat: 13.71649482989272, lng: 100.5474149798927 },
                southwest: { lat: 13.71379517010728, lng: 100.5447153201073 }
              }
            },
            icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/school-71.png",
            icon_background_color: "#7B9EB0",
            icon_mask_base_uri:
              "https://maps.gstatic.com/mapfiles/place_api/icons/v2/school_pinlet",
            name: "Garden International School Bangkok",
            opening_hours: { open_now: false },
            photos: [
              {
                height: 3456,
                html_attributions: [
                  '<a href="https://maps.google.com/maps/contrib/112186300645307285846">A Google User</a>'
                ],
                photo_reference:
                  "AWU5eFhariP9U3I_lPGhLpHv_jgNKsvq53DVZ2zgAelsgDHd9i9omI4yFuQMbKxLMPZChjIw5xHNnafo8YxBOPmcf-M3ESLzUWgGKZiTIjVSrCzQ5-CKmxEbJaltr7dHPQTkQrZT9e_zPtq4aR7qUQZQPmjOrw6EwaEFVa32x7lWGkCtbXyg",
                width: 5184
              }
            ],
            place_id: "ChIJ9Uj8_6uY4jAR6f5MikdcLW8",
            plus_code: {
              compound_code: "PG8W+39 Bangkok",
              global_code: "7P52PG8W+39"
            },
            rating: 3.7,
            reference: "ChIJ9Uj8_6uY4jAR6f5MikdcLW8",
            scope: "GOOGLE",
            types: ["school", "point_of_interest", "establishment"],
            user_ratings_total: 31,
            vicinity: "2, Akart Yen Akat Rd, Thung Maha Mek, Sathon"
          },
          {
            business_status: "OPERATIONAL",
            geometry: {
              location: { lat: 13.7197262, lng: 100.5761604 },
              viewport: {
                northeast: { lat: 13.72107297989272, lng: 100.5775429298927 },
                southwest: { lat: 13.71837332010728, lng: 100.5748432701073 }
              }
            },
            icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/school-71.png",
            icon_background_color: "#7B9EB0",
            icon_mask_base_uri:
              "https://maps.gstatic.com/mapfiles/place_api/icons/v2/school_pinlet",
            name: "HEI Schools Bangkok - International Kindergarten",
            opening_hours: { open_now: false },
            photos: [
              {
                height: 1333,
                html_attributions: [
                  '<a href="https://maps.google.com/maps/contrib/102113756920856338245">A Google User</a>'
                ],
                photo_reference:
                  "AWU5eFhwCY67tAOxLwp9-46nGrYLj7e7ybNIay1YCNyw1n4Oe-krJpWH9eHOAn0pq-3VUVozy34ZZ4cuiYOPd-pyQnzpjhQFMcvj2pkpfHrO8GBUBlRqADgrY5-soCvpHDJ7qOuR0Fpp_9ZOQjSnoW_aem293xp8qhlp5jvu0XjjnHuevJiV",
                width: 2000
              }
            ],
            place_id: "ChIJB5LJvq2f4jARlBUisH2nvjw",
            plus_code: {
              compound_code: "PH9G+VF Bangkok",
              global_code: "7P52PH9G+VF"
            },
            rating: 5,
            reference: "ChIJB5LJvq2f4jARlBUisH2nvjw",
            scope: "GOOGLE",
            types: ["school", "point_of_interest", "establishment"],
            user_ratings_total: 2,
            vicinity: "Sukhumvit 36, Khlong Tan, Khlong Toei"
          }
        ]
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
        "Ok, I’ve set the min bedrooms to 3. Is there anything else you’d like me to do?",
      state: factory()
    }
  }
];

export default timeline;
