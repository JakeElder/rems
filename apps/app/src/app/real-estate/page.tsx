import {
  Breadcrumbs,
  FilterBar,
  Footer,
  Header,
  RealEstateIndexPage as Page,
  Pagination,
  FiltersContext,
  CountAndSort,
  PropertyGrid,
  ListingMap,
  RealEstateQueryController
} from "@rems/ui";
import api from "../../api";
import { SearchParams } from "@rems/types";
import { MAX_LIVING_AREA_SIZES, MIN_LIVING_AREA_SIZES } from "../../constants";
import adapters from "../../adapters";

type Props = {
  searchParams: SearchParams;
};

export default async function Home({ searchParams }: Props) {
  const query = adapters.searchParamsToPartialQuery(searchParams);

  const [
    btsStations,
    indoorFeatures,
    lotFeatures,
    mrtStations,
    outdoorFeatures,
    viewTypes,
    propertyTypes,
    quickFilters
  ] = await Promise.all([
    api.get.btsStations(),
    api.get.indoorFeatures(),
    api.get.lotFeatures(),
    api.get.mrtStations(),
    api.get.outdoorFeatures(),
    api.get.viewTypes(),
    api.get.propertyTypes(),
    api.get.quickFilters()
  ]);

  return (
    <Page.Root>
      <RealEstateQueryController query={query}>
        <Page.Header>
          <Header full mode="standard" />
          <FiltersContext
            value={{
              btsStations,
              indoorFeatures,
              lotFeatures,
              mrtStations,
              outdoorFeatures,
              propertyTypes,
              viewTypes,
              livingAreaSizes: {
                min: MIN_LIVING_AREA_SIZES,
                max: MAX_LIVING_AREA_SIZES
              },
              quickFilters
            }}
          >
            <FilterBar />
          </FiltersContext>
        </Page.Header>
        <Page.Main>
          <Page.Content>
            <Page.Breadcrumbs>
              <Breadcrumbs />
            </Page.Breadcrumbs>
            <Page.Title>Homes for sale in Thailand</Page.Title>
            <Page.CountAndSort>
              <CountAndSort />
            </Page.CountAndSort>
            <Page.Properties>
              <PropertyGrid />
            </Page.Properties>
            <Page.Pagination>
              <Pagination />
            </Page.Pagination>
          </Page.Content>
          <Page.Map>
            <ListingMap />
          </Page.Map>
        </Page.Main>
        <Page.Footer>
          <Footer full />
        </Page.Footer>
      </RealEstateQueryController>
    </Page.Root>
  );
}
