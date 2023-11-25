import { diffString } from "json-diff";
import * as app from "../src/slices/app";
import {
  handleAssistantPlacementChangeRequest,
  handleAssistantYield,
  handleEmptySubmission,
  handleInputIdle,
  handleUserYield,
  returnControl,
  setArray,
  setBudgetAndAvailability,
  setLocationSource,
  setPageAndSort,
  setSpaceRequirements
} from "../src/slices/app/actions";

// const log = (obj: any) => console.dir(obj, { depth: null, colors: true });

test("budget", () => {
  const store = app.init({
    slices: {
      realEstateQuery: {
        budgetAndAvailability: { maxPrice: 5 }
      }
    }
  });

  store.dispatch(
    setBudgetAndAvailability({
      role: "ASSISTANT",
      data: { type: "RENT", maxPrice: 10 }
    })
  );

  // log(store.getState());
});

test("locationSource", () => {
  const store = app.init();

  store.dispatch(
    setLocationSource({
      role: "ASSISTANT",
      data: {
        type: "NL",
        radius: null,
        radiusEnabled: false,
        description: "Chiang Mai",
        geospatialOperator: "near"
      }
    })
  );

  // log(store.getState());
});

test("pageAndSort", () => {
  const store = app.init();

  store.dispatch(
    setPageAndSort({
      role: "ASSISTANT",
      data: { page: 4 }
    })
  );

  // log(store.getState())
});

test("space", () => {
  const store = app.init();

  store.dispatch(
    setSpaceRequirements({
      role: "ASSISTANT",
      data: { maxBedrooms: 4 }
    })
  );

  // log(store.getState());
});

test("array", () => {
  const store = app.init({
    slices: {
      realEstateQuery: {
        viewTypes: [{ id: 2, name: "Two" }]
      }
    }
  });

  store.dispatch(
    setArray({
      role: "ASSISTANT",
      prop: "viewTypes",
      group: "View Types",
      data: [{ id: 1, name: "One", slug: "one" }]
    })
  );

  // log(store.getState())
});

test("emptySubmission", () => {
  const store = app.init({
    slices: {
      assistant: {
        sessions: [{ id: "one", state: "INPUTTING" }]
      }
    }
  });

  store.dispatch(handleEmptySubmission());

  const state = store.getState();

  const { sessions } = state.slices.assistant;
  expect(sessions[sessions.length - 1].state).toBe("INACTIVE");
});

test("userYield", () => {
  const store = app.init();

  store.dispatch(handleUserYield("Do stuff"));

  const state = store.getState();

  expect(state.slices.assistant.mode).toBe("THINKING");
  expect(state.slices.assistant.sessions[0].state).toBe("ANALYZING");
  expect(state.timeline.length).toBe(1);
});

test("assistantYield", () => {
  const store = app.init();

  store.dispatch(handleAssistantYield("Sure, done"));

  const state = store.getState();

  expect(state.slices.assistant.sessions[0].state).toBe("RESOLVED");
  expect(state.timeline.length).toBe(1);
});

test("placementChangeRequest", () => {
  const store = app.init();

  store.dispatch(handleAssistantPlacementChangeRequest("EXPAND"));
  expect(store.getState().slices.assistant.placement).toBe("DOCKED");

  store.dispatch(handleAssistantPlacementChangeRequest("EXPAND"));
  expect(store.getState().slices.assistant.placement).toBe("WINDOWED");

  store.dispatch(handleAssistantPlacementChangeRequest("FRAME_LEFT"));
  expect(store.getState().slices.assistant.placement).toBe("LEFT");
});

test("returnControl", () => {
  const store = app.init({
    slices: {
      assistant: {
        mode: "WORKING"
      }
    }
  });

  store.dispatch(returnControl());

  const state = store.getState();
  const { sessions } = state.slices.assistant;

  expect(sessions.length).toBe(2);
  expect(sessions[sessions.length - 1].state).toBe("INACTIVE");
});

test("inputIdle", () => {
  const store = app.init({
    slices: {
      assistant: {
        sessions: [{ id: "id", value: "Do stuff", state: "INPUTTING" }]
      }
    }
  });

  store.dispatch(handleInputIdle());

  const state = store.getState();
  const { sessions } = state.slices.assistant;

  expect(sessions[sessions.length - 1].state).toBe("INACTIVE");
});

// console.log(diffString(i, state));
