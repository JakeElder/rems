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
  ListingMap
} from "@rems/ui";
import api from "../../api";
import { realEstateQuerySchema } from "@rems/types";
import { flatten } from "remeda";
import { MAX_LIVING_AREA_SIZES, MIN_LIVING_AREA_SIZES } from "../../constants";
import QueryController from "./QueryController";

const processSearchParams = (params: {
  [key: string]: string | string[] | undefined;
}) => {
  return {
    ...params,
    "indoor-features": flatten([params["indoor-features[]"]]),
    "lot-features": flatten([params["lot-features[]"]]),
    "outdoor-features": flatten([params["outdoor-features[]"]]),
    "property-type": flatten([params["property-type[]"]]),
    "view-types": flatten([params["view-types[]"]])
  };
};

export default async function Home({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = realEstateQuerySchema.parse(processSearchParams(searchParams));

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
          <QueryController query={query}>
            <FilterBar />
          </QueryController>
        </FiltersContext>
      </Page.Header>
      <Page.Main>
        <Page.Content>
          <Page.Breadcrumbs>
            <Breadcrumbs />
          </Page.Breadcrumbs>
          <Page.Title>Homes for sale in Thailand</Page.Title>
          <Page.CountAndSort>
            <QueryController query={query}>
              <CountAndSort />
            </QueryController>
          </Page.CountAndSort>
          <Page.Properties>
            <QueryController query={query}>
              <PropertyGrid />
            </QueryController>
          </Page.Properties>
          <Page.Pagination>
            <QueryController query={query}>
              <Pagination />
            </QueryController>
          </Page.Pagination>
        </Page.Content>
        <Page.Map>
          <QueryController query={query}>
            <ListingMap />
          </QueryController>
        </Page.Map>
      </Page.Main>
      <Page.Footer>
        <Footer full />
      </Page.Footer>
    </Page.Root>
  );
}
