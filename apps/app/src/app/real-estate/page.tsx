import { Suspense } from "react";
import { FilterBar, RealEstateIndexPage as Page } from "@rems/ui";
import QuickFiltersContainer from "../../server-components/QuickFiltersContainer";

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
            <Suspense>
              <QuickFiltersContainer />
            </Suspense>
          </FilterBar.QuickFilters>
        </FilterBar.Root>
      </Page.Header>
      <Suspense>
        <AsyncComp />
      </Suspense>
    </Page.Root>
  );
}
