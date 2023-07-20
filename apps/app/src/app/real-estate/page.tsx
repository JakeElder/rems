import { Breadcrumbs, FilterBar, RealEstateIndexPage as Page } from "@rems/ui";
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

export default function Home() {
  return (
    <Page.Root>
      <Page.Header>
        <FilterBar.Root>
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
