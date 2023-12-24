import { createAction } from "@reduxjs/toolkit";
import {
  AssistantPlacementAction,
  RealEstateQuery,
  InputSession,
  Location,
  RealEstateIndexPageAndSort,
  SpaceRequirements,
  Filter,
  RealEstateQueryArrayKey,
  BudgetAndAvailabilityRequirements,
  UserTimelineEvent,
  AssistantTimelineEvent,
  AppStateSlices,
  Analysis,
  IntentResolutionError,
  Property,
  AssistantPlacement,
  AssistantLanguage
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

export const handleVoiceInputReceived = createAction<
  InputSession["value"],
  "HANDLE_VOICE_INPUT_RECEIVED"
>("HANDLE_VOICE_INPUT_RECEIVED");

export const noop = createAction("NOOP");

export const registerAnalysis = createAction<Analysis, "REGISTER_ANALYSIS">(
  "REGISTER_ANALYSIS"
);

export const registerIntentResolutionError = createAction<
  IntentResolutionError,
  "REGISTER_INTENT_RESOLUTION"
>("REGISTER_INTENT_RESOLUTION");

export const registerSelectedProperty = createAction<
  {
    role: ActorTimelineEvent["role"];
    property: Property | null;
    reason?: string;
  },
  "REGISTER_SELECTED_PROPERTY"
>("REGISTER_SELECTED_PROPERTY");

export const replaceRealEstateQuery = createAction<
  RealEstateQuery,
  "REPLACE_REAL_ESTATE_QUERY"
>("REPLACE_REAL_ESTATE_QUERY");

export const resetRealEstateQuery = createAction("RESET_REAL_ESTATE_QUERY");

export const returnControl = createAction("RETURN_CONTROL");

export const setArray = createAction<
  QueryMutationAction<
    Filter[],
    {
      group: string;
      prop: RealEstateQueryArrayKey;
    }
  >,
  "SET_ARRAY"
>("SET_ARRAY");

export const setAssistantChatting = createAction("SET_ASSISTANT_CHATTING");
export const setAssistantLanguage = createAction<
  AssistantLanguage,
  "SET_ASSISTANT_LANGUAGE"
>("SET_ASSISTANT_LANGUAGE");
export const setAssistantPlacement = createAction<
  AssistantPlacement,
  "SET_ASSISTANT_PLACEMENT"
>("SET_ASSISTANT_PLACEMENT");
export const setAssistantWorking = createAction("SET_ASSISTANT_WORKING");

export const setBudgetAndAvailability = createAction<
  QueryMutationAction<Partial<BudgetAndAvailabilityRequirements>>,
  "SET_BUDGET_AND_AVAILABILITY"
>("SET_BUDGET_AND_AVAILABILITY");

export const setLocation = createAction<
  QueryMutationAction<{ prev: Location; next: Location }>,
  "SET_LOCATION"
>("SET_LOCATION");

export const setPageAndSort = createAction<
  QueryMutationAction<Partial<RealEstateIndexPageAndSort>>,
  "SET_PAGE_AND_SORT"
>("SET_PAGE_AND_SORT");

export const setResolvingIntents = createAction("SET_RESOLVING_INTENTS");

export const setSelectedProperty = createAction<
  {
    role: ActorTimelineEvent["role"];
    id: Property["id"] | null;
  },
  "SET_SELECTED_PROPERTY"
>("SET_SELECTED_PROPERTY");

export const setSpaceRequirements = createAction<
  QueryMutationAction<Partial<SpaceRequirements>>,
  "SET_SPACE_REQUIREMENTS"
>("SET_SPACE_REQUIREMENTS");

export const yld = createAction<
  {
    role: ActorTimelineEvent["role"];
    message: string;
    state: AppStateSlices;
  },
  "YIELD"
>("YIELD");

// Action Type
type CommitRealEstateQueryAction = ReturnType<typeof commitRealEstateQuery>;
type HandleAssistantPlacementChangeRequestAction = ReturnType<
  typeof handleAssistantPlacementChangeRequest
>;
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
type HandleVoiceInputReceivedAction = ReturnType<
  typeof handleVoiceInputReceived
>;
type NoopAction = ReturnType<typeof noop>;
type RegisterAnalysisAction = ReturnType<typeof registerAnalysis>;
type RegisterIntentResolutionErrorAction = ReturnType<
  typeof registerIntentResolutionError
>;
type RegisterSelectedPropertyAction = ReturnType<
  typeof registerSelectedProperty
>;
type ReplaceRealEstateQueryAction = ReturnType<typeof replaceRealEstateQuery>;
type ResetRealEstateQueryAction = ReturnType<typeof resetRealEstateQuery>;
type ReturnControlAction = ReturnType<typeof returnControl>;
type SetArrayAction = ReturnType<typeof setArray>;
type SetAssistantChattingAction = ReturnType<typeof setAssistantChatting>;
type SetAssistantLanguageAction = ReturnType<typeof setAssistantLanguage>;
type SetAssistantPlacementAction = ReturnType<typeof setAssistantPlacement>;
type SetAssistantWorkingAction = ReturnType<typeof setAssistantWorking>;
type SetBudgetAndAvailabilityAction = ReturnType<
  typeof setBudgetAndAvailability
>;
type SetLocationAction = ReturnType<typeof setLocation>;
type SetPageAndSortAction = ReturnType<typeof setPageAndSort>;
type SetResolvingIntentsAction = ReturnType<typeof setResolvingIntents>;
type SetSelectedPropertyAction = ReturnType<typeof setSelectedProperty>;
type SetSpaceRequirementsAction = ReturnType<typeof setSpaceRequirements>;
type YieldAction = ReturnType<typeof yld>;

export type AppAction =
  | CommitRealEstateQueryAction
  | HandleAssistantPlacementChangeRequestAction
  | HandleEmptySubmissionAction
  | HandleEnterKeyDownAction
  | HandleEnterKeyUpAction
  | HandleInputIdleAction
  | HandleKeyboardInputReceivedAction
  | HandleListeningAbortedAction
  | HandleListeningStartedAction
  | HandleSpaceKeyDownAction
  | HandleSpaceKeyUpAction
  | HandleVoiceInputReceivedAction
  | NoopAction
  | RegisterAnalysisAction
  | RegisterIntentResolutionErrorAction
  | RegisterSelectedPropertyAction
  | ReplaceRealEstateQueryAction
  | ResetRealEstateQueryAction
  | ReturnControlAction
  | SetArrayAction
  | SetAssistantChattingAction
  | SetAssistantLanguageAction
  | SetAssistantPlacementAction
  | SetAssistantWorkingAction
  | SetBudgetAndAvailabilityAction
  | SetLocationAction
  | SetPageAndSortAction
  | SetResolvingIntentsAction
  | SetSelectedPropertyAction
  | SetSpaceRequirementsAction
  | YieldAction;
