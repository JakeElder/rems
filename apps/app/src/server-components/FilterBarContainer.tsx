import React from "react";
import BedsFilterPopoverViewContainer from "../client-components/BedsFilterPopoverViewContainer";
import PriceFilterPopoverViewContainer from "../client-components/PriceFilterPopoverViewContainer";
import AvailabilityFilterPopoverViewContainer from "../client-components/AvailabilityFilterPopoverViewContainer";
import TypeFilterPopoverContainer from "../server-components/TypeFilterPopoverContainer";
import FilterDialogViewContainer from "../client-components/FilterDialogViewContainer";
import TypeFiltersContainer from "../server-components/TypeFiltersContainer";
import AvailabilityFilterViewContainer from "../client-components/AvailabilityFilterViewContainer";
import AreaFilterContainer from "../server-components/AreaFilterContainer";
import PriceRangeViewContainer from "../client-components/PriceRangeViewContainer";
import BedsFilterViewContainer from "../client-components/BedsFilterViewContainer";
import BathroomsFilterViewContainer from "../client-components/BathroomsFilterViewContainer";
import ViewTypeFiltersContainer from "../server-components/ViewTypeFiltersContainer";
import IndoorFeatureFiltersContainer from "../server-components/IndoorFeatureFiltersContainer";
import OutdoorFeatureFiltersContainer from "../server-components/OutdoorFeatureFiltersContainer";
import LotFeatureFiltersContainer from "../server-components/LotFeatureFiltersContainer";
import LivingAreaFiltersViewContainer from "../client-components/LivingAreaFiltersViewContainer";
import LotSizeFiltersViewContainer from "../client-components/LotSizeFiltersViewContainer";
import NearestMRTStationFilterContainer from "../server-components/NearestMRTStationFilter";
import NearestBTSStationFilterContainer from "../server-components/NearestBTSStationFilter";
import { PropertyFilters, FilterBar as Layout } from "@rems/ui";
import QuickFiltersContainer from "./QuickFiltersContainer";
import PlacesAutocompleteViewContainer from "../client-components/PlacesAutocompleteViewContainer";

type Props = {};

const FilterBarContainer = ({}: Props) => {
  return (
    <Layout.Root>
      <Layout.FilterDialog>
        <FilterDialogViewContainer>
          <PropertyFilters.PropertyType>
            <TypeFiltersContainer id="filters" />
          </PropertyFilters.PropertyType>
          <PropertyFilters.Location>
            <PlacesAutocompleteViewContainer />
          </PropertyFilters.Location>
          <PropertyFilters.AvailabilityAndArea>
            <PropertyFilters.Availability>
              <AvailabilityFilterViewContainer />
            </PropertyFilters.Availability>
            <PropertyFilters.Area>
              <AreaFilterContainer />
            </PropertyFilters.Area>
          </PropertyFilters.AvailabilityAndArea>
          <PropertyFilters.PriceRange>
            <PriceRangeViewContainer />
          </PropertyFilters.PriceRange>
          <PropertyFilters.Bedrooms>
            <BedsFilterViewContainer />
          </PropertyFilters.Bedrooms>
          <PropertyFilters.Bathrooms>
            <BathroomsFilterViewContainer />
          </PropertyFilters.Bathrooms>
          <PropertyFilters.View>
            <ViewTypeFiltersContainer />
          </PropertyFilters.View>
          <PropertyFilters.IndoorFeatures>
            <IndoorFeatureFiltersContainer />
          </PropertyFilters.IndoorFeatures>
          <PropertyFilters.OutdoorFeatures>
            <OutdoorFeatureFiltersContainer />
          </PropertyFilters.OutdoorFeatures>
          <PropertyFilters.LotFeatures>
            <LotFeatureFiltersContainer />
          </PropertyFilters.LotFeatures>
          <PropertyFilters.LivingArea>
            <LivingAreaFiltersViewContainer />
          </PropertyFilters.LivingArea>
          <PropertyFilters.LotSize>
            <LotSizeFiltersViewContainer />
          </PropertyFilters.LotSize>
          <PropertyFilters.NearestMRTStation>
            <NearestMRTStationFilterContainer />
          </PropertyFilters.NearestMRTStation>
          <PropertyFilters.NearestBTSStation>
            <NearestBTSStationFilterContainer />
          </PropertyFilters.NearestBTSStation>
        </FilterDialogViewContainer>
      </Layout.FilterDialog>
      <Layout.Separator />
      <Layout.KeyFilters>
        <TypeFilterPopoverContainer />
        <AvailabilityFilterPopoverViewContainer />
        <PriceFilterPopoverViewContainer />
        <BedsFilterPopoverViewContainer />
      </Layout.KeyFilters>
      <Layout.Separator />
      <Layout.QuickFilters>
        <QuickFiltersContainer />
      </Layout.QuickFilters>
    </Layout.Root>
  );
};

export default FilterBarContainer;
