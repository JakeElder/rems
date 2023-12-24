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
import RealEstateIndexPageContentViewContainer from "@/components/client/RealEstateIndexPageContentViewContainer";
import CountAndSortViewContainer from "@/components/client/CountAndSortViewContainer";
import PropertyGridViewContainer from "@/components/client/PropertyGridViewContainer";
import PaginationViewContainer from "@/components/client/PaginationViewContainer";
import FooterContainer from "@/components/server/FooterContainer";
import RealEstateIndexPageTitleContainer from "@/components/server/RealEstateIndexPageTitleContainer";
import ChatViewContainer from "@/components/client/ChatViewContainer";
import AssistantCallbackProvider from "@/components/client/AssistantCallbackProvider";

type Props = {
  searchParams?: SearchParams;
};

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
          <AssistantCallbackProvider>
            <Page.Root>
              <ChatViewContainer />
              <ToastHub>
                <RealEstateIndexPageHeaderViewContainer>
                  <HeaderViewContainer full mode="standard" chat />
                  <FilterBarContainer />
                </RealEstateIndexPageHeaderViewContainer>
                <Page.Main>
                  <RealEstateIndexPageContentViewContainer>
                    <RealEstateIndexPageTitleContainer
                      searchParams={searchParams}
                    />
                    <Page.CountAndSort>
                      <CountAndSortViewContainer />
                    </Page.CountAndSort>
                    <Page.Properties>
                      <PropertyGridViewContainer />
                    </Page.Properties>
                    <Page.Pagination>
                      <PaginationViewContainer />
                    </Page.Pagination>
                  </RealEstateIndexPageContentViewContainer>
                  <Page.Map>
                    <ListingMapViewContainer />
                  </Page.Map>
                </Page.Main>
                <Page.Footer>
                  <FooterContainer full />
                </Page.Footer>
              </ToastHub>
            </Page.Root>
          </AssistantCallbackProvider>
        </DomElementsProvider>
      </QuerySyncContainer>
    </StateProviderContainer>
  );
}
