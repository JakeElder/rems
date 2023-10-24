import { DeepPartial } from "@reduxjs/toolkit";
import * as app from "../src/slices/app";
import extend from "deep-extend";
import { AppState } from "@rems/types";
import { diffString } from "json-diff";

const initial = <T extends DeepPartial<AppState>>(
  state: T = {} as T
): AppState => extend<{}, AppState, T>({}, app.defaults, state);

const log = (obj: any) => console.dir(obj, { depth: null, colors: true });

test("budget", () => {
  const { store, actions } = app.init(
    initial({
      slices: {
        realEstateQuery: {
          budgetAndAvailability: { maxPrice: 5 }
        }
      }
    })
  );

  store.dispatch(
    actions.setBudgetAndAvailability({
      role: "ASSISTANT",
      data: { type: "RENT", maxPrice: 10 }
    })
  );

  // log(store.getState());
});

test("locationSource", () => {
  const { store, actions } = app.init(initial());

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

  // log(store.getState());
});

test("pageAndSort", () => {
  const { store, actions } = app.init(initial());

  store.dispatch(
    actions.setPageAndSort({
      role: "ASSISTANT",
      data: { page: 4 }
    })
  );

  // log(store.getState())
});

test("space", () => {
  const { store, actions } = app.init(initial());

  store.dispatch(
    actions.setSpace({
      role: "ASSISTANT",
      data: { maxBedrooms: 4 }
    })
  );

  // log(store.getState());
});

test("array", () => {
  const { store, actions } = app.init(
    initial({
      slices: {
        realEstateQuery: {
          viewTypes: [{ id: 2, name: "Two" }]
        }
      }
    })
  );

  store.dispatch(
    actions.setArray({
      role: "ASSISTANT",
      prop: "viewTypes",
      group: "View Types",
      data: [{ id: 1, name: "One" }]
    })
  );

  // log(store.getState())
});

test("emptySubmission", () => {
  const { store, actions } = app.init(
    initial({
      slices: {
        assistant: {
          sessions: [{ id: "one", state: "INPUTTING" }]
        }
      }
    })
  );

  store.dispatch(actions.handleEmptySubmission());

  const state = store.getState();

  const { sessions } = state.slices.assistant;
  expect(sessions[sessions.length - 1].state).toBe("INACTIVE");
});

test("userYield", () => {
  const i = initial();
  const { store, actions } = app.init(i);

  store.dispatch(actions.handleUserYield("Do stuff"));

  const state = store.getState();

  expect(state.slices.assistant.mode).toBe("THINKING");
  expect(state.slices.assistant.sessions[0].state).toBe("ANALYZING");
  expect(state.timeline.length).toBe(1);
});

test("assistantYield", () => {
  const i = initial();
  const { store, actions } = app.init(i);

  store.dispatch(actions.handleAssistantYield("Sure, done"));

  const state = store.getState();

  expect(state.slices.assistant.sessions[0].state).toBe("RESOLVED");
  expect(state.timeline.length).toBe(1);
});

test("placementChangeRequest", () => {
  const i = initial();
  const { store, actions } = app.init(i);

  store.dispatch(actions.handleAssistantPlacementChangeRequest("EXPAND"));
  expect(store.getState().slices.assistant.placement).toBe("DOCKED");

  store.dispatch(actions.handleAssistantPlacementChangeRequest("EXPAND"));
  expect(store.getState().slices.assistant.placement).toBe("WINDOWED");

  store.dispatch(actions.handleAssistantPlacementChangeRequest("FRAME_LEFT"));
  expect(store.getState().slices.assistant.placement).toBe("LEFT");
});

test("returnControl", () => {
  const i = initial({
    slices: {
      assistant: {
        mode: "WORKING"
      }
    }
  });

  const { store, actions } = app.init(i);

  store.dispatch(actions.returnControl());

  const state = store.getState();
  const { sessions } = state.slices.assistant;

  expect(sessions.length).toBe(2);
  expect(sessions[sessions.length - 1].state).toBe("INACTIVE");
});

test("inputIdle", () => {
  const i = initial({
    slices: {
      assistant: {
        sessions: [{ id: "id", value: "Do stuff", state: "INPUTTING" }]
      }
    }
  });

  const { store, actions } = app.init(i);

  store.dispatch(actions.handleInputIdle());

  const state = store.getState();
  const { sessions } = state.slices.assistant;

  expect(sessions[sessions.length - 1].state).toBe("INACTIVE");
});

// console.log(diffString(i, state));
