import * as app from "@rems/state/app";
import { AppState } from "@rems/types";
import {
  TypedUseSelectorHook,
  useDispatch as originalUseDispatch,
  useSelector as originalUseSelector
} from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { AppDispatch } from "@rems/state";

/*
 * Selectors
 */
const selectActiveIndoorFeatureFilters = (state: AppState) =>
  state.slices.stagedRealEstateQuery.indoorFeatures;

const selectActiveOutdoorFeatureFilters = (state: AppState) =>
  state.slices.stagedRealEstateQuery.outdoorFeatures;

const selectActiveLotFeatureFilters = (state: AppState) =>
  state.slices.stagedRealEstateQuery.lotFeatures;

const selectActiveViewTypeFilters = (state: AppState) =>
  state.slices.stagedRealEstateQuery.viewTypes;

const selectActivePropertyTypeFilters = (state: AppState) =>
  state.slices.stagedRealEstateQuery.propertyTypes;

const selectActiveQuickFilters = createSelector(
  [
    selectActiveIndoorFeatureFilters,
    selectActiveOutdoorFeatureFilters,
    selectActiveLotFeatureFilters,
    selectActiveViewTypeFilters
  ],
  (indoorFeatures, outdoorFeatures, lotFeatures, viewTypes) => ({
    indoorFeatures,
    outdoorFeatures,
    lotFeatures,
    viewTypes
  })
);

const selectHasBedsFilter = createSelector(
  [
    (state: AppState) => state.slices.stagedRealEstateQuery.space.minBedrooms,
    (state: AppState) => state.slices.stagedRealEstateQuery.space.maxBedrooms
  ],
  (min, max) => {
    const defaults = app.defaults();
    const { space } = defaults.slices.stagedRealEstateQuery;
    return min !== space.minBedrooms || max !== space.maxBedrooms;
  }
);

const selectHasPriceFilter = createSelector(
  [
    (state: AppState) =>
      state.slices.stagedRealEstateQuery.budgetAndAvailability.minPrice,
    (state: AppState) =>
      state.slices.stagedRealEstateQuery.budgetAndAvailability.maxPrice
  ],
  (min, max) => {
    const defaults = app.defaults();
    const { budgetAndAvailability } = defaults.slices.stagedRealEstateQuery;
    return (
      min !== budgetAndAvailability.minPrice ||
      max !== budgetAndAvailability.maxPrice
    );
  }
);

const selectHasPropertyTypesFilter = createSelector(
  [selectActivePropertyTypeFilters],
  (filters) => filters.length > 0
);

const selectActiveIndoorFeaturesCount = (state: AppState) =>
  state.slices.stagedRealEstateQuery.indoorFeatures.length;

const selectActiveOutdoorFeaturesCount = (state: AppState) =>
  state.slices.stagedRealEstateQuery.outdoorFeatures.length;

const selectActiveLotFeaturesCount = (state: AppState) =>
  state.slices.stagedRealEstateQuery.lotFeatures.length;

const selectActiveViewTypesCount = (state: AppState) =>
  state.slices.stagedRealEstateQuery.viewTypes.length;

const selectActivePriceFilterCount = createSelector(
  [selectHasPriceFilter],
  (has) => (has ? 1 : 0)
);

const selectActiveBedsFilterCount = createSelector(
  [selectHasBedsFilter],
  (has) => (has ? 1 : 0)
);

const selectActivePropertyTypeFiltersCount = createSelector(
  [selectHasPropertyTypesFilter],
  (has) => (has ? 1 : 0)
);

const selectActiveFiltersCount = createSelector(
  [
    selectActiveIndoorFeaturesCount,
    selectActiveOutdoorFeaturesCount,
    selectActiveLotFeaturesCount,
    selectActiveViewTypesCount,
    selectActivePriceFilterCount,
    selectActiveBedsFilterCount,
    selectActivePropertyTypeFiltersCount
  ],
  (...counts) => counts.reduce((a, v) => a + v, 0)
);

/*
 * Typed Hooks
 */
export const useDispatch: () => AppDispatch = originalUseDispatch;
export const useSelector: TypedUseSelectorHook<AppState> = originalUseSelector;

/*
 * Selector Hooks
 */
export const useActiveFiltersCount = () =>
  useSelector(selectActiveFiltersCount);

export const useRealEstateQuery = () =>
  useSelector((state) => state.slices.realEstateQuery);

export const useStagedRealEstateQuery = () =>
  useSelector((state) => state.slices.stagedRealEstateQuery);

export const useHasPriceFilter = () => useSelector(selectHasPriceFilter);
export const useHasBedsFilter = () => useSelector(selectHasBedsFilter);
export const useHasPropertyTypesFilter = () =>
  useSelector(selectHasPropertyTypesFilter);

export const useActiveQuickFilters = () =>
  useSelector(selectActiveQuickFilters);

export const useActiveIndoorFeatureFilters = () =>
  useSelector(selectActiveIndoorFeatureFilters);

export const useActiveOutdoorFeatureFilters = () =>
  useSelector(selectActiveOutdoorFeatureFilters);

export const useActiveLotFeatureFilters = () =>
  useSelector(selectActiveLotFeatureFilters);

export const useActiveViewTypeFilters = () =>
  useSelector(selectActiveViewTypeFilters);

export const useActivePropertyTypeFilters = () =>
  useSelector(selectActivePropertyTypeFilters);

/*
 * Store
 */
const { store, actions } = app.init();
export { store };

/*
 * Actions
 */
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
