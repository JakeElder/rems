import { createAction } from "@reduxjs/toolkit";
import {
  AssistantPlacementAction,
  RealEstateQuery,
  InputSession,
  LocationSource,
  RealEstateIndexPageAndSort,
  SpaceRequirements,
  Filter,
  RealEstateQueryArrayKey,
  BudgetAndAvailabilityRequirements,
  UserTimelineEvent,
  AssistantTimelineEvent,
  AppStateSlices
} from "@rems/types";

type ActorTimelineEvent = UserTimelineEvent | AssistantTimelineEvent;
type QueryMutationAction<T = void, E = {}> = {
  role: ActorTimelineEvent["role"];
  data: T;
} & E;

export const commitRealEstateQuery = createAction("COMMIT_REAL_ESTATE_QUERY");

export const handleAssistantPlacementChangeRequest = createAction<
  AssistantPlacementAction,
  "HANDLE_ASSISTANT_PLACEMENT_CHANGE_REQUEST"
>("HANDLE_ASSISTANT_PLACEMENT_CHANGE_REQUEST");

export const handleAssistantYield = createAction<
  {
    state: AppStateSlices;
    message: InputSession["value"];
  },
  "HANDLE_ASSISTANT_YIELD"
>("HANDLE_ASSISTANT_YIELD");

export const handleEmptySubmission = createAction("HANDLE_EMPTY_SUBMISSION");

export const handleEnterKeyDown = createAction("HANDLE_ENTER_KEY_DOWN");

export const handleEnterKeyUp = createAction("HANDLE_ENTER_KEY_UP");

export const handleInputIdle = createAction("HANDLE_INPUT_IDLE");

export const handleKeyboardInputReceived = createAction<
  InputSession["value"],
  "HANDLE_KEYBOARD_INPUT_RECEIVED"
>("HANDLE_KEYBOARD_INPUT_RECEIVED");

export const handleListeningAborted = createAction("HANDLE_LISTENING_ABORTED");

export const handleListeningStarted = createAction("HANDLE_LISTENING_STARTED");

export const handleSpaceKeyDown = createAction("HANDLE_SPACE_KEY_DOWN");

export const handleSpaceKeyUp = createAction("HANDLE_SPACE_KEY_UP");

export const handleUserYield = createAction<
  {
    state: AppStateSlices;
    message: InputSession["value"];
  },
  "HANDLE_USER_YIELD"
>("HANDLE_USER_YIELD");

export const handleVoiceInputReceived = createAction<
  InputSession["value"],
  "HANDLE_VOICE_INPUT_RECEIVED"
>("HANDLE_VOICE_INPUT_RECEIVED");

export const replaceRealEstateQuery = createAction<
  RealEstateQuery,
  "REPLACE_REAL_ESTATE_QUERY"
>("REPLACE_REAL_ESTATE_QUERY");

export const resetRealEstateQuery = createAction("RESET_REAL_ESTATE_QUERY");

export const returnControl = createAction("RETURN_CONTROL");

export const setArray = createAction<
  QueryMutationAction<
    Filter[],
    { group: string; prop: RealEstateQueryArrayKey }
  >,
  "SET_ARRAY"
>("SET_ARRAY");

export const setBudgetAndAvailability = createAction<
  QueryMutationAction<Partial<BudgetAndAvailabilityRequirements>>,
  "SET_BUDGET_AND_AVAILABILITY"
>("SET_BUDGET_AND_AVAILABILITY");

export const setLocationSource = createAction<
  QueryMutationAction<LocationSource>,
  "SET_LOCATION_SOURCE"
>("SET_LOCATION_SOURCE");

export const setPageAndSort = createAction<
  QueryMutationAction<Partial<RealEstateIndexPageAndSort>>,
  "SET_PAGE_AND_SORT"
>("SET_PAGE_AND_SORT");

export const setResolvingIntents = createAction("SET_RESOLVING_INTENTS");

export const setSpaceRequirements = createAction<
  QueryMutationAction<Partial<SpaceRequirements>>,
  "SET_SPACE_REQUIREMENTS"
>("SET_SPACE_REQUIREMENTS");

// Action Type
type CommitRealEstateQueryAction = ReturnType<typeof commitRealEstateQuery>;
type HandleAssistantPlacementChangeRequestAction = ReturnType<
  typeof handleAssistantPlacementChangeRequest
>;
type HandleAssistantYieldAction = ReturnType<typeof handleAssistantYield>;
type HandleEmptySubmissionAction = ReturnType<typeof handleEmptySubmission>;
type HandleEnterKeyDownAction = ReturnType<typeof handleEnterKeyDown>;
type HandleEnterKeyUpAction = ReturnType<typeof handleEnterKeyUp>;
type HandleInputIdleAction = ReturnType<typeof handleInputIdle>;
type HandleKeyboardInputReceivedAction = ReturnType<
  typeof handleKeyboardInputReceived
>;
type HandleListeningAbortedAction = ReturnType<typeof handleListeningAborted>;
type HandleListeningStartedAction = ReturnType<typeof handleListeningStarted>;
type HandleSpaceKeyDownAction = ReturnType<typeof handleSpaceKeyDown>;
type HandleSpaceKeyUpAction = ReturnType<typeof handleSpaceKeyUp>;
type HandleUserYieldAction = ReturnType<typeof handleUserYield>;
type HandleVoiceInputReceivedAction = ReturnType<
  typeof handleVoiceInputReceived
>;
type ReplaceRealEstateQueryAction = ReturnType<typeof replaceRealEstateQuery>;
type ResetRealEstateQueryAction = ReturnType<typeof resetRealEstateQuery>;
type ReturnControlAction = ReturnType<typeof returnControl>;
type SetArrayAction = ReturnType<typeof setArray>;
type SetBudgetAndAvailabilityAction = ReturnType<
  typeof setBudgetAndAvailability
>;
type SetLocationSourceAction = ReturnType<typeof setLocationSource>;
type SetPageAndSortAction = ReturnType<typeof setPageAndSort>;
type SetResolvingIntentsAction = ReturnType<typeof setResolvingIntents>;
type SetSpaceRequirementsAction = ReturnType<typeof setSpaceRequirements>;

export type AppAction =
  | CommitRealEstateQueryAction
  | HandleAssistantPlacementChangeRequestAction
  | HandleAssistantYieldAction
  | HandleEmptySubmissionAction
  | HandleEnterKeyDownAction
  | HandleEnterKeyUpAction
  | HandleInputIdleAction
  | HandleKeyboardInputReceivedAction
  | HandleListeningAbortedAction
  | HandleListeningStartedAction
  | HandleSpaceKeyDownAction
  | HandleSpaceKeyUpAction
  | HandleUserYieldAction
  | HandleVoiceInputReceivedAction
  | ReplaceRealEstateQueryAction
  | ResetRealEstateQueryAction
  | ReturnControlAction
  | SetArrayAction
  | SetBudgetAndAvailabilityAction
  | SetLocationSourceAction
  | SetPageAndSortAction
  | SetResolvingIntentsAction
  | SetSpaceRequirementsAction;
