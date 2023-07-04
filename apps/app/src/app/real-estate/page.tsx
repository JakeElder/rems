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
  FiltersContext
} from "@rems/ui";
import api from "../../api";
import slugify from "@sindresorhus/slugify";

export default async function Home() {
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
