import * as app from "../src/slices/app";

const log = (obj: any) => console.dir(obj, { depth: null, colors: true });

test("budget", () => {
  const { store, actions } = app.init({
    slices: {
      realEstateQuery: {
        budgetAndAvailability: { maxPrice: 5 }
      }
    }
  });

  store.dispatch(
    actions.setBudgetAndAvailability({
      role: "ASSISTANT",
      data: { type: "RENT", maxPrice: 10 }
    })
  );

  // log(store.getState());
});

test("locationSource", () => {
  const { store, actions } = app.init();

  store.dispatch(
    actions.setLocationSource({
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
  const { store, actions } = app.init();

  store.dispatch(
    actions.setPageAndSort({
      role: "ASSISTANT",
      data: { page: 4 }
    })
  );

  // log(store.getState())
});

test("space", () => {
  const { store, actions } = app.init();

  store.dispatch(
    actions.setSpace({
      role: "ASSISTANT",
      data: { maxBedrooms: 4 }
    })
  );

  // log(store.getState());
});

test("array", () => {
  const { store, actions } = app.init({
    slices: {
      realEstateQuery: {
        viewTypes: [{ id: 2, name: "Two" }]
      }
    }
  });

  store.dispatch(
    actions.setArray({
      role: "ASSISTANT",
      prop: "viewTypes",
      group: "View Types",
      data: [{ id: 1, name: "One", slug: "one" }]
    })
  );

  // log(store.getState())
});

test("emptySubmission", () => {
  const { store, actions } = app.init({
    slices: {
      assistant: {
        sessions: [{ id: "one", state: "INPUTTING" }]
      }
    }
  });

  store.dispatch(actions.handleEmptySubmission());

  const state = store.getState();

  const { sessions } = state.slices.assistant;
  expect(sessions[sessions.length - 1].state).toBe("INACTIVE");
});

test("userYield", () => {
  const { store, actions } = app.init();

  store.dispatch(actions.handleUserYield("Do stuff"));

  const state = store.getState();

  expect(state.slices.assistant.mode).toBe("THINKING");
  expect(state.slices.assistant.sessions[0].state).toBe("ANALYZING");
  expect(state.timeline.length).toBe(1);
});

test("assistantYield", () => {
  const { store, actions } = app.init();

  store.dispatch(actions.handleAssistantYield("Sure, done"));

  const state = store.getState();

  expect(state.slices.assistant.sessions[0].state).toBe("RESOLVED");
  expect(state.timeline.length).toBe(1);
});

test("placementChangeRequest", () => {
  const { store, actions } = app.init();

  store.dispatch(actions.handleAssistantPlacementChangeRequest("EXPAND"));
  expect(store.getState().slices.assistant.placement).toBe("DOCKED");

  store.dispatch(actions.handleAssistantPlacementChangeRequest("EXPAND"));
  expect(store.getState().slices.assistant.placement).toBe("WINDOWED");

  store.dispatch(actions.handleAssistantPlacementChangeRequest("FRAME_LEFT"));
  expect(store.getState().slices.assistant.placement).toBe("LEFT");
});

test("returnControl", () => {
  const { store, actions } = app.init({
    slices: {
      assistant: {
        mode: "WORKING"
      }
    }
  });

  store.dispatch(actions.returnControl());

  const state = store.getState();
  const { sessions } = state.slices.assistant;

  expect(sessions.length).toBe(2);
  expect(sessions[sessions.length - 1].state).toBe("INACTIVE");
});

test("inputIdle", () => {
  const { store, actions } = app.init({
    slices: {
      assistant: {
        sessions: [{ id: "id", value: "Do stuff", state: "INPUTTING" }]
      }
    }
  });

  store.dispatch(actions.handleInputIdle());

  const state = store.getState();
  const { sessions } = state.slices.assistant;

  expect(sessions[sessions.length - 1].state).toBe("INACTIVE");
});

// console.log(diffString(i, state));
