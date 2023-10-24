import {
  createSlice,
  configureStore,
  PayloadAction,
  nanoid
} from "@reduxjs/toolkit";
import defaults from "./defaults";
import * as diff from "../../diff";
import {
  AppState,
  AppStateSlices,
  BudgetAndAvailabilityRequirements,
  LocationSource,
  RealEstateIndexPageAndSort,
  RealEstateQueryArrayKey,
  SpaceRequirements,
  TimelineEvent
} from "@rems/types";
import { Identifiable } from "../..";

type MutationAction<T, E = {}> = PayloadAction<
  {
    role: "ASSISTANT" | "USER";
    data: T;
  } & E
>;

type AppStateMutationTimelineEvent = Extract<
  TimelineEvent,
  { role: "USER" | "ASSISTANT" }
>;

type AppStateMutation = Extract<
  AppStateMutationTimelineEvent["event"],
  { type: "STATE_MUTATION" }
>;

const $event = ({
  role,
  prev,
  next,
  patch
}: Pick<AppStateMutationTimelineEvent, "role"> &
  AppStateMutation["mutation"]): AppStateMutationTimelineEvent => ({
  id: nanoid(),
  date: Date.now(),
  role,
  event: {
    type: "STATE_MUTATION",
    mutation: {
      next,
      prev,
      patch
    }
  }
});

const setBudgetAndAvailability = (
  state: AppState,
  action: MutationAction<Partial<BudgetAndAvailabilityRequirements>>
) => {
  const prev: AppStateSlices = state.slices;
  const next: AppStateSlices = {
    ...prev,
    realEstateQuery: {
      ...prev.realEstateQuery,
      budgetAndAvailability: {
        ...prev.realEstateQuery.budgetAndAvailability,
        ...action.payload.data
      }
    }
  };

  const event = $event({
    role: "ASSISTANT",
    prev,
    next,
    patch: {
      type: "SCALAR",
      group: "Budget & Availability",
      data: action.payload.data,
      diff: diff.scalar(
        defaults.slices.realEstateQuery.budgetAndAvailability,
        prev.realEstateQuery.budgetAndAvailability,
        action.payload.data
      )
    }
  });

  state.timeline.push(event);
  state.slices = next;
};

const setLocationSource = (
  state: AppState,
  action: MutationAction<LocationSource>
) => {
  const prev: AppStateSlices = state.slices;
  const next: AppStateSlices = {
    ...prev,
    realEstateQuery: {
      ...prev.realEstateQuery,
      locationSource: action.payload.data
    }
  };

  const event = $event({
    role: "ASSISTANT",
    prev,
    next,
    patch: {
      type: "SCALAR",
      group: "Location",
      data: action.payload.data,
      diff: diff.scalar(
        defaults.slices.realEstateQuery.locationSource,
        prev.realEstateQuery.locationSource,
        action.payload.data
      )
    }
  });

  state.timeline.push(event);
  state.slices = next;
};

const setPageAndSort = (
  state: AppState,
  action: MutationAction<Partial<RealEstateIndexPageAndSort>>
) => {
  const prev: AppStateSlices = state.slices;
  const next: AppStateSlices = {
    ...prev,
    realEstateQuery: {
      ...prev.realEstateQuery,
      pageAndSort: {
        ...prev.realEstateQuery.pageAndSort,
        ...action.payload.data
      }
    }
  };

  const event = $event({
    role: "ASSISTANT",
    prev,
    next,
    patch: {
      type: "SCALAR",
      group: "Page & Sort",
      data: action.payload.data,
      diff: diff.scalar(
        defaults.slices.realEstateQuery.pageAndSort,
        prev.realEstateQuery.pageAndSort,
        action.payload.data
      )
    }
  });

  state.timeline.push(event);
  state.slices = next;
};

const setSpace = (
  state: AppState,
  action: MutationAction<Partial<SpaceRequirements>>
) => {
  const prev: AppStateSlices = state.slices;
  const next: AppStateSlices = {
    ...prev,
    realEstateQuery: {
      ...prev.realEstateQuery,
      space: {
        ...prev.realEstateQuery.space,
        ...action.payload.data
      }
    }
  };

  const event = $event({
    role: "ASSISTANT",
    prev,
    next,
    patch: {
      type: "SCALAR",
      group: "Space Requirements",
      data: action.payload.data,
      diff: diff.scalar(
        defaults.slices.realEstateQuery.space,
        prev.realEstateQuery.space,
        action.payload.data
      )
    }
  });

  state.timeline.push(event);
  state.slices = next;
};

const setArray = (
  state: AppState,
  action: MutationAction<
    Identifiable[],
    {
      group: string;
      prop: RealEstateQueryArrayKey;
    }
  >
) => {
  const prev: AppStateSlices = state.slices;
  const next: AppStateSlices = {
    ...prev,
    realEstateQuery: {
      ...prev.realEstateQuery,
      [action.payload.prop]: action.payload.data
    }
  };

  const event = $event({
    role: "ASSISTANT",
    prev,
    next,
    patch: {
      type: "ARRAY",
      group: action.payload.group,
      value: action.payload.data,
      prop: action.payload.prop,
      diff: diff.array(
        prev.realEstateQuery[action.payload.prop],
        action.payload.data
      )
    }
  });

  state.timeline.push(event);
  state.slices = next;
};

const rootSlice = (initialState: AppState) => {
  const slice = createSlice({
    name: "root",
    initialState,
    reducers: {
      setBudgetAndAvailability,
      setLocationSource,
      setPageAndSort,
      setSpace,
      setArray
    }
  });

  const store = configureStore({ reducer: slice.reducer });
  const { actions } = slice;

  return { store, actions };
};

export default rootSlice;
