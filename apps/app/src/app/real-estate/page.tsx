import {
  Breadcrumbs,
  CountAndSort,
  FilterBar,
  Footer,
  Header,
  ListingMap,
  RealEstateIndexPage as Page,
  Pagination,
  PropertyCard,
  FiltersContext,
  RealEstateQueryController
} from "@rems/ui";
import api from "../../api";
import slugify from "@sindresorhus/slugify";
import { realEstateQuerySchema } from "@rems/types";
import { flatten } from "remeda";

const processSearchParams = (params: {
  [key: string]: string | string[] | undefined;
}) => {
  return {
    ...params,
    "indoor-features": flatten([params["indoor-features[]"]]),
    "lot-features": flatten([params["lot-features[]"]]),
    "outdoor-features": flatten([params["outdoor-features[]"]]),
    "property-type": flatten([params["property-type[]"]]),
    "view-type": flatten([params["view-type[]"]])
  };
};

export default async function Home({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = realEstateQuerySchema.parse(processSearchParams(searchParams));
  const { ids } = await api.query.properties();
  const properties = await api.get.properties(...ids);

  const [
    btsStations,
    indoorFeatures,
    lotFeatures,
    mrtStations,
    outdoorFeatures,
    viewTypes,
    propertyTypes
  ] = await Promise.all([
    api.get.btsStations(),
    api.get.indoorFeatures(),
    api.get.lotFeatures(),
    api.get.mrtStations(),
    api.get.outdoorFeatures(),
    api.get.viewTypes(),
    api.get.propertyTypes()
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
            viewTypes
          }}
        >
          <RealEstateQueryController query={query}>
            <FilterBar />
          </RealEstateQueryController>
        </FiltersContext>
      </Page.Header>
      <Page.Main>
        <Page.Content>
          <Page.Breadcrumbs>
            <Breadcrumbs />
          </Page.Breadcrumbs>
          <Page.Title>Homes for sale in Thailand</Page.Title>
          <Page.CountAndSort>
            <CountAndSort count={properties.length} />
          </Page.CountAndSort>
          <Page.Properties>
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                link={`/real-estate/${slugify(p.title)}-${p.id}`}
              />
            ))}
          </Page.Properties>
          <Page.Pagination>
            <Pagination />
          </Page.Pagination>
        </Page.Content>
        <Page.Map>
          <ListingMap properties={properties} />
        </Page.Map>
      </Page.Main>
      <Page.Footer>
        <Footer full />
      </Page.Footer>
    </Page.Root>
  );
}
