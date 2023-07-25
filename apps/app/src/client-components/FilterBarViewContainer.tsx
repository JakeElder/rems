import React from "react";
import BedsFilterPopoverViewContainer from "./BedsFilterPopoverViewContainer";
import PriceFilterPopoverViewContainer from "./PriceFilterPopoverViewContainer";
import AvailabilityFilterPopoverViewContainer from "./AvailabilityFilterPopoverViewContainer";
import FilterDialogViewContainer from "./FilterDialogViewContainer";
import AvailabilityFilterViewContainer from "./AvailabilityFilterViewContainer";
import PriceRangeViewContainer from "./PriceRangeViewContainer";
import BedsFilterViewContainer from "./BedsFilterViewContainer";
import BathroomsFilterViewContainer from "./BathroomsFilterViewContainer";
import LivingAreaFiltersViewContainer from "./LivingAreaFiltersViewContainer";
import LotSizeFiltersViewContainer from "./LotSizeFiltersViewContainer";
import { PropertyFilters, FilterBar as Layout } from "@rems/ui";

import TypeFilterPopoverContainer from "../server-components/TypeFilterPopoverContainer";
import TypeFiltersContainer from "../server-components/TypeFiltersContainer";
import AreaFilterContainer from "../server-components/AreaFilterContainer";
import ViewTypeFiltersContainer from "../server-components/ViewTypeFiltersContainer";
import IndoorFeatureFiltersContainer from "../server-components/IndoorFeatureFiltersContainer";
import OutdoorFeatureFiltersContainer from "../server-components/OutdoorFeatureFiltersContainer";
import LotFeatureFiltersContainer from "../server-components/LotFeatureFiltersContainer";
import NearestMRTStationFilterContainer from "../server-components/NearestMRTStationFilter";
import NearestBTSStationFilterContainer from "../server-components/NearestBTSStationFilter";
import QuickFiltersContainer from "../server-components/QuickFiltersContainer";

type Props = {};

const FilterBarViewContainer = ({}: Props) => {
  return (
    <Layout.Root>
      <Layout.FilterDialog>
        <FilterDialogViewContainer>
          <PropertyFilters.PropertyType>
            <TypeFiltersContainer id="filters" />
          </PropertyFilters.PropertyType>
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

export default FilterBarViewContainer;
