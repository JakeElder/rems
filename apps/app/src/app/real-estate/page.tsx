import { Suspense } from "react";
import { Breadcrumbs, FilterBar, RealEstateIndexPage as Page } from "@rems/ui";
import QuickFiltersContainer from "../../server-components/QuickFiltersContainer";
import PropertyGridViewContainer from "../../client-components/PropertyGridViewContainer";
import ListingMapViewContainer from "../../client-components/ListingMapViewContainer";

const AsyncComp = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
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
          <Page.Properties>
            <PropertyGridViewContainer />
          </Page.Properties>
        </Page.Content>
        <Page.Map>
          <ListingMapViewContainer />
        </Page.Map>
      </Page.Main>
      <Suspense>
        <AsyncComp />
      </Suspense>
    </Page.Root>
  );
}
