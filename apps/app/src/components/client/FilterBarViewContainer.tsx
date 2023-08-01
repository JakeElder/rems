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
import TypeFiltersViewContainer from "./TypeFiltersViewContainer";
import {
  Area,
  BTSStation,
  IndoorFeature,
  LotFeature,
  MRTStation,
  OutdoorFeature,
  PropertyType,
  QuickFilter,
  ViewType
} from "@rems/types";
import TypeFilterPopoverViewContainer from "./TypeFilterPopoverViewContainer";
import ViewTypeFiltersViewContainer from "./ViewTypeFiltersViewContainer";
import IndoorFeatureFiltersViewContainer from "./IndoorFeatureFiltersViewContainer";
import OutdoorFeatureFiltersViewContainer from "./OutdoorFeatureFiltersViewContainer";
import LotFeatureFiltersViewContainer from "./LotFeatureFiltersViewContainer";
import NearestMRTStationFilterViewContainer from "./NearestMRTStationFilterViewContainer";
import NearestBTSStationFilterViewContainer from "./NearestBTSStationFilterViewContainer";
import QuickFiltersViewContainer from "./QuickFiltersViewContainer";
import PlacesAutocompleteViewContainer from "./PlacesAutocompleteViewContainer";
import SearchRadiusViewContainer from "./SearchRadiusViewContainer";
import AreaFilterViewContainer from "./AreaFilterViewContainer";

type Props = {
  propertyTypes: PropertyType[];
  areas: Area[];
  viewTypes: ViewType[];
  indoorFeatures: IndoorFeature[];
  outdoorFeatures: OutdoorFeature[];
  lotFeatures: LotFeature[];
  mrtStations: MRTStation[];
  btsStations: BTSStation[];
  quickFilters: QuickFilter[];
};

const FilterBarViewContainer = ({
  propertyTypes,
  areas,
  viewTypes,
  indoorFeatures,
  outdoorFeatures,
  lotFeatures,
  mrtStations,
  btsStations,
  quickFilters
}: Props) => {
  return (
    <Layout.Root>
      <Layout.FilterDialog>
        <FilterDialogViewContainer>
          <PropertyFilters.PropertyType>
            <TypeFiltersViewContainer id="filter-bar" types={propertyTypes} />
          </PropertyFilters.PropertyType>
          <PropertyFilters.Location>
            <PlacesAutocompleteViewContainer />
          </PropertyFilters.Location>
          <PropertyFilters.SearchRadius>
            <SearchRadiusViewContainer />
          </PropertyFilters.SearchRadius>
          <PropertyFilters.AvailabilityAndArea>
            <PropertyFilters.Availability>
              <AvailabilityFilterViewContainer />
            </PropertyFilters.Availability>
            <PropertyFilters.Area>
              <AreaFilterViewContainer areas={areas} />
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
            <ViewTypeFiltersViewContainer types={viewTypes} />
          </PropertyFilters.View>
          <PropertyFilters.IndoorFeatures>
            <IndoorFeatureFiltersViewContainer features={indoorFeatures} />
          </PropertyFilters.IndoorFeatures>
          <PropertyFilters.OutdoorFeatures>
            <OutdoorFeatureFiltersViewContainer features={outdoorFeatures} />
          </PropertyFilters.OutdoorFeatures>
          <PropertyFilters.LotFeatures>
            <LotFeatureFiltersViewContainer features={lotFeatures} />
          </PropertyFilters.LotFeatures>
          <PropertyFilters.LivingArea>
            <LivingAreaFiltersViewContainer />
          </PropertyFilters.LivingArea>
          <PropertyFilters.LotSize>
            <LotSizeFiltersViewContainer />
          </PropertyFilters.LotSize>
          <PropertyFilters.NearestMRTStation>
            <NearestMRTStationFilterViewContainer stations={mrtStations} />
          </PropertyFilters.NearestMRTStation>
          <PropertyFilters.NearestBTSStation>
            <NearestBTSStationFilterViewContainer stations={btsStations} />
          </PropertyFilters.NearestBTSStation>
        </FilterDialogViewContainer>
      </Layout.FilterDialog>
      <Layout.Separator />
      <Layout.KeyFilters>
        <TypeFilterPopoverViewContainer types={propertyTypes} />
        <AvailabilityFilterPopoverViewContainer />
        <PriceFilterPopoverViewContainer />
        <BedsFilterPopoverViewContainer />
      </Layout.KeyFilters>
      <Layout.Separator />
      <Layout.QuickFilters>
        <QuickFiltersViewContainer filters={quickFilters} />
      </Layout.QuickFilters>
    </Layout.Root>
  );
};

export default FilterBarViewContainer;
