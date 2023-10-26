import { PropertyFilters, FilterBar as Layout } from "@rems/ui";
import BedsFilterPopoverViewContainer from "@/components/client/BedsFilterPopoverViewContainer";
import PriceFilterPopoverViewContainer from "@/components/client/PriceFilterPopoverViewContainer";
import AvailabilityFilterPopoverViewContainer from "@/components/client/AvailabilityFilterPopoverViewContainer";
import TypeFilterPopoverContainer from "@/components/server/TypeFilterPopoverContainer";
import FilterDialogViewContainer from "@/components/client/FilterDialogViewContainer";
import TypeFiltersContainer from "@/components/server/TypeFiltersContainer";
import AvailabilityFilterViewContainer from "@/components/client/AvailabilityFilterViewContainer";
import PriceRangeViewContainer from "@/components/client/PriceRangeViewContainer";
import BedsFilterViewContainer from "@/components/client/BedsFilterViewContainer";
import BathroomsFilterViewContainer from "@/components/client/BathroomsFilterViewContainer";
import ViewTypeFiltersContainer from "@/components/server/ViewTypeFiltersContainer";
import IndoorFeatureFiltersContainer from "@/components/server/IndoorFeatureFiltersContainer";
import OutdoorFeatureFiltersContainer from "@/components/server/OutdoorFeatureFiltersContainer";
import LotFeatureFiltersContainer from "@/components/server/LotFeatureFiltersContainer";
import LivingAreaFiltersViewContainer from "@/components/client/LivingAreaFiltersViewContainer";
import LotSizeFiltersViewContainer from "@/components/client/LotSizeFiltersViewContainer";
import QuickFiltersContainer from "@/components/server/QuickFiltersContainer";
import PlacesAutocompleteViewContainer from "@/components/client/PlacesAutocompleteViewContainer";

type Props = {};

const FilterBarContainer = ({}: Props) => {
  return (
    <Layout.Root>
      <Layout.FilterDialog>
        <FilterDialogViewContainer>
          <PropertyFilters.PropertyType>
            <TypeFiltersContainer id="filters" />
          </PropertyFilters.PropertyType>
          <PropertyFilters.Availability>
            <AvailabilityFilterViewContainer />
          </PropertyFilters.Availability>
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

// <Layout.FilterDialog>
//   <FilterDialogViewContainer>
//     <PropertyFilters.Location>
//       <PlacesAutocompleteViewContainer />
//     </PropertyFilters.Location>
//
//     <PropertyFilters.LotFeatures>
//       <LotFeatureFiltersContainer />
//     </PropertyFilters.LotFeatures>
//     <PropertyFilters.LivingArea>
//       <LivingAreaFiltersViewContainer />
//     </PropertyFilters.LivingArea>
//     <PropertyFilters.LotSize>
//       <LotSizeFiltersViewContainer />
//     </PropertyFilters.LotSize>
//   </FilterDialogViewContainer>
// </Layout.FilterDialog>

export default FilterBarContainer;
