import { Metadata } from "next";
import { RealEstateIndexPage as Page, ToastHub } from "@rems/ui";
import fetch from "@/fetch";
import StateProviderContainer from "@/components/server/StateProviderContainer";
import { SearchParams } from "@rems/types";
import FilterBarContainer from "@/components/server/FilterBarContainer";
import QuerySyncContainer from "@/components/server/QuerySyncContainer";
import RealEstateIndexPageHeaderViewContainer from "@/components/client/RealEstateIndexPageHeaderViewContainer";
import HeaderViewContainer from "@/components/client/HeaderViewContainer";
import DomElementsProvider from "@/components/client/DomElementsProvider";
import ListingMapViewContainer from "@/components/client/ListingMapViewContainer";

type Props = { searchParams?: SearchParams };

export async function generateMetadata(): Promise<Metadata> {
  const config = await fetch("app-config");
  return {
    title: config.defaultTitle,
    description: config.defaultDescription
  };
}

export default async function RealEstateIndexPage({ searchParams }: Props) {
  return (
    <StateProviderContainer searchParams={searchParams}>
      <QuerySyncContainer>
        <DomElementsProvider>
          <Page.Root>
            <ToastHub>
              <RealEstateIndexPageHeaderViewContainer>
                <HeaderViewContainer full mode="standard" />
                <FilterBarContainer />
              </RealEstateIndexPageHeaderViewContainer>
              <Page.Main>
                <Page.Map>
                  <ListingMapViewContainer />
                </Page.Map>
              </Page.Main>
            </ToastHub>
          </Page.Root>
        </DomElementsProvider>
      </QuerySyncContainer>
    </StateProviderContainer>
  );
}
