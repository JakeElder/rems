import {
  Breadcrumbs,
  FilterBar,
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
import {
  MAX_LIVING_AREA_SIZES,
  MAX_LOT_SIZES,
  MAX_PURCHASE_PRICE,
  MAX_RENTAL_PRICE,
  MIN_LIVING_AREA_SIZES,
  MIN_LOT_SIZES,
  MIN_PURCHASE_PRICE,
  MIN_RENTAL_PRICE
} from "../../constants";
import adapters from "../../adapters";
import { Metadata } from "next";
import Footer from "../../components/Footer";
import Analytics from "../../components/Analytics";

type Props = {
  params: { id: string };
  searchParams: SearchParams;
};

export async function generateMetadata({
  searchParams
}: Props): Promise<Metadata> {
  const query = adapters.searchParamsToPartialQuery(searchParams);
  const type = query["availability"] === "rent" ? "Rent" : "Sale";
  const config = await api.get.appConfig();

  return {
    title: `Homes for ${type} in Bangkok Thailand`,
    description: config.defaultDescription
  };
}

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
    quickFilters,
    areas
  ] = await Promise.all([
    api.get.btsStations(),
    api.get.indoorFeatures(),
    api.get.lotFeatures(),
    api.get.mrtStations(),
    api.get.outdoorFeatures(),
    api.get.viewTypes(),
    api.get.propertyTypes(),
    api.get.quickFilters(),
    api.get.areas()
  ]);

  return (
    <Page.Root>
      <Analytics />
      <RealEstateQueryController query={query}>
        <Page.Header>
          <Header full mode="standard" />
          <FiltersContext
            value={{
              areas,
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
              lotSizes: {
                min: MIN_LOT_SIZES,
                max: MAX_LOT_SIZES
              },
              priceRange: {
                minRentalPrice: MIN_RENTAL_PRICE,
                maxRentalPrice: MAX_RENTAL_PRICE,
                minPurchasePrice: MIN_PURCHASE_PRICE,
                maxPurchasePrice: MAX_PURCHASE_PRICE
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
              <Breadcrumbs
                items={[
                  { children: "Home", href: "/" },
                  { children: "Real Estate", href: "/real-estate" }
                ]}
              />
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
