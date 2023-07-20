import { Breadcrumbs, FilterBar, RealEstateIndexPage as Page } from "@rems/ui";
import FooterContainer from "../../server-components/FooterContainer";
import PropertyGridViewContainer from "../../client-components/PropertyGridViewContainer";
import ListingMapViewContainer from "../../client-components/ListingMapViewContainer";
import QuickFiltersContainer from "../../server-components/QuickFiltersContainer";
import CountAndSortViewContainer from "../../client-components/CountAndSortViewContainer";

const AsyncComp = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
  return null;
};

export default function Home() {
  return (
    <Page.Root>
      <Page.Header>
        <FilterBar.Root>
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
