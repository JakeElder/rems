import { DeepPartial } from "@reduxjs/toolkit";
import * as app from "../src/slices/app";
import extend from "deep-extend";
import { AppState } from "@rems/types";

test("budget", () => {
  const initial = extend<{}, AppState, DeepPartial<AppState>>(
    {},
    app.defaults,
    {
      slices: {
        realEstateQuery: {
          budgetAndAvailability: { maxPrice: 5 }
        }
      }
    }
  );

  const { store, actions } = app.slice(initial);

  store.subscribe(() =>
    console.dir(store.getState(), { depth: null, colors: true })
  );

  store.dispatch(
    actions.setBudgetAndAvailability({
      role: "ASSISTANT",
      data: { type: "RENT", maxPrice: 10 }
    })
  );
});

test("locationSource", () => {
  const initial = extend<{}, AppState>({}, app.defaults);

  const { store, actions } = app.slice(initial);

  store.subscribe(() =>
    console.dir(store.getState(), { depth: null, colors: true })
  );

  store.dispatch(
    actions.setLocationSource({
      role: "ASSISTANT",
      data: {
        type: "NL",
        radius: null,
        description: "Chiang Mai",
        geospatialOperator: "near"
      }
    })
  );
});

test("pageAndSort", () => {
  const initial = extend<{}, AppState>({}, app.defaults);
  const { store, actions } = app.slice(initial);

  store.subscribe(() =>
    console.dir(store.getState(), { depth: null, colors: true })
  );

  store.dispatch(
    actions.setPageAndSort({
      role: "ASSISTANT",
      data: { page: 4 }
    })
  );
});

test("space", () => {
  const initial = extend<{}, AppState>({}, app.defaults);
  const { store, actions } = app.slice(initial);

  store.subscribe(() =>
    console.dir(store.getState(), { depth: null, colors: true })
  );

  store.dispatch(
    actions.setSpace({
      role: "ASSISTANT",
      data: { maxBedrooms: 4 }
    })
  );
});

test("array", () => {
  const initial = extend<{}, AppState, DeepPartial<AppState>>(
    {},
    app.defaults,
    {
      slices: {
        realEstateQuery: {
          viewTypes: [{ id: 2, name: "Two" }]
        }
      }
    }
  );
  const { store, actions } = app.slice(initial);

  store.subscribe(() =>
    console.dir(store.getState(), { depth: null, colors: true })
  );

  store.dispatch(
    actions.setArray({
      role: "ASSISTANT",
      prop: "viewTypes",
      group: "View Types",
      data: [{ id: 1, name: "One" }]
    })
  );
});
