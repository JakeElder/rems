import {
  Breadcrumbs,
  Header,
  RealEstateIndexPage as Page,
  Pagination,
  CountAndSort,
  PropertyGrid,
  ListingMap,
  RealEstateQueryController
} from "@rems/ui";
import api from "../../api";
import { SearchParams } from "@rems/types";
import adapters from "../../adapters";
import { Metadata } from "next";
import Footer from "../../components/Footer";
import Analytics from "../../components/Analytics";
import { Suspense } from "react";
import FilterBar from "../../components/FilterBar";

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

  return (
    <Page.Root>
      <Analytics />
      <RealEstateQueryController query={query}>
        <Page.Header>
          <Header full mode="standard" />
          <Suspense>
            <FilterBar />
          </Suspense>
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
