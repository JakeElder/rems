import * as app from "@rems/state/app";
import { AppState } from "@rems/types";
import {
  TypedUseSelectorHook,
  useDispatch as originalUseDispatch,
  useSelector as originalUseSelector
} from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

const { store, actions } = app.init();

export const {
  commitRealEstateQuery,
  handleAssistantPlacementChangeRequest,
  handleAssistantYield,
  handleEmptySubmission,
  handleEnterKeyDown,
  handleEnterKeyUp,
  handleInputIdle,
  handleKeyboardInputReceived,
  handleListeningAborted,
  handleListeningStarted,
  handleSpaceKeyDown,
  handleSpaceKeyUp,
  handleUserYield,
  handleVoiceInputReceived,
  replaceRealEstateQuery,
  returnControl,
  setArray,
  setBudgetAndAvailability,
  setLocationSource,
  setPageAndSort,
  setResolvingIntents,
  setSpace
} = actions;

export { store };

type AppDispatch = typeof store.dispatch;
type ActionTypes = typeof actions;

export type Actions = {
  [K in keyof ActionTypes]: ReturnType<ActionTypes[K]>;
}[keyof ActionTypes];

export const useDispatch: () => AppDispatch = originalUseDispatch;
export const useSelector: TypedUseSelectorHook<AppState> = originalUseSelector;

export const useActiveQuickFilters = () =>
  useSelector(
    createSelector(
      [
        (state: AppState) => state.slices.stagedRealEstateQuery.indoorFeatures,
        (state: AppState) => state.slices.stagedRealEstateQuery.outdoorFeatures,
        (state: AppState) => state.slices.stagedRealEstateQuery.lotFeatures,
        (state: AppState) => state.slices.stagedRealEstateQuery.viewTypes
      ],
      (indoorFeatures, outdoorFeatures, lotFeatures, viewTypes) => ({
        indoorFeatures,
        outdoorFeatures,
        lotFeatures,
        viewTypes
      })
    )
  );

export const useHasBedsFilter = () =>
  useSelector(
    createSelector(
      [
        (state: AppState) =>
          state.slices.stagedRealEstateQuery.space.minBedrooms,
        (state: AppState) =>
          state.slices.stagedRealEstateQuery.space.maxBedrooms
      ],
      (min, max) => {
        const defaults = app.defaults();
        const { space } = defaults.slices.stagedRealEstateQuery;
        return min !== space.minBedrooms || max !== space.maxBedrooms;
      }
    )
  );

export const useRealEstateQuery = () =>
  useSelector((state) => state.slices.realEstateQuery);

export const useStagedRealEstateQuery = () =>
  useSelector((state) => state.slices.stagedRealEstateQuery);
