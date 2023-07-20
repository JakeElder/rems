import {
  Breadcrumbs,
  FilterBar,
  NearestMRTStationFilter,
  RealEstateIndexPage as Page,
  PropertyFilters
} from "@rems/ui";
import FooterContainer from "../../server-components/FooterContainer";
import PropertyGridViewContainer from "../../client-components/PropertyGridViewContainer";
import ListingMapViewContainer from "../../client-components/ListingMapViewContainer";
import QuickFiltersContainer from "../../server-components/QuickFiltersContainer";
import CountAndSortViewContainer from "../../client-components/CountAndSortViewContainer";
import PaginationViewContainer from "../../client-components/PaginationViewContainer";
import BedsFilterPopoverViewContainer from "../../client-components/BedsFilterPopoverViewContainer";
import PriceFilterPopoverViewContainer from "../../client-components/PriceFilterPopoverViewContainer";
import AvailabilityFilterPopoverViewContainer from "../../client-components/AvailabilityFilterPopoverViewContainer";
import TypeFilterPopoverContainer from "../../server-components/TypeFilterPopoverContainer";
import FilterDialogViewContainer from "../../client-components/FilterDialogViewContainer";
import TypeFiltersContainer from "../../server-components/TypeFiltersContainer";
import AvailabilityFilterViewContainer from "../../client-components/AvailabilityFilterViewContainer";
import AreaFilterContainer from "../../server-components/AreaFilterContainer";
import PriceRangeViewContainer from "../../client-components/PriceRangeViewContainer";
import BedsFilterViewContainer from "../../client-components/BedsFilterViewContainer";
import BathroomsFilterViewContainer from "../../client-components/BathroomsFilterViewContainer";
import ViewTypeFiltersContainer from "../../server-components/ViewTypeFiltersContainer";
import IndoorFeatureFiltersContainer from "../../server-components/IndoorFeatureFiltersContainer";
import OutdoorFeatureFiltersContainer from "../../server-components/OutdoorFeatureFiltersContainer";
import LotFeatureFiltersContainer from "../../server-components/LotFeatureFiltersContainer";
import LivingAreaFiltersViewContainer from "../../client-components/LivingAreaFiltersViewContainer";
import LotSizeFiltersViewContainer from "../../client-components/LotSizeFiltersViewContainer";
import NearestMRTStationFilterContainer from "../../server-components/NearestMRTStationFilter";
import NearestBTSStationFilterContainer from "../../server-components/NearestBTSStationFilter";

export default function Home() {
  return (
    <Page.Root>
      <Page.Header>
        <FilterBar.Root>
          <FilterBar.FilterDialog>
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
          </FilterBar.FilterDialog>
          <FilterBar.Separator />
          <FilterBar.KeyFilters>
            <TypeFilterPopoverContainer />
            <AvailabilityFilterPopoverViewContainer />
            <PriceFilterPopoverViewContainer />
            <BedsFilterPopoverViewContainer />
          </FilterBar.KeyFilters>
          <FilterBar.Separator />
          <FilterBar.QuickFilters>
            <QuickFiltersContainer />
          </FilterBar.QuickFilters>
        </FilterBar.Root>
      </Page.Header>
      <Page.Main>
        <Page.Content>
          <Page.Breadcrumbs>
            <Breadcrumbs
              items={[
                { children: "Home", href: "/" },
                { children: "Real Estate", href: "/real-estate" }
              ]}
            />
          </Page.Breadcrumbs>
          <Page.Title />
          <Page.CountAndSort>
            <CountAndSortViewContainer />
          </Page.CountAndSort>
          <Page.Properties>
            <PropertyGridViewContainer />
          </Page.Properties>
          <Page.Pagination>
            <PaginationViewContainer />
          </Page.Pagination>
        </Page.Content>
        <Page.Map>
          <ListingMapViewContainer />
        </Page.Map>
      </Page.Main>
      <Page.Footer>
        <FooterContainer full />
      </Page.Footer>
    </Page.Root>
  );
}
