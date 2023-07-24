import { Breadcrumbs, RealEstateIndexPage as Page, ToastHub } from "@rems/ui";
import FooterContainer from "../../server-components/FooterContainer";
import PropertyGridViewContainer from "../../client-components/PropertyGridViewContainer";
import ListingMapViewContainer from "../../client-components/ListingMapViewContainer";
import CountAndSortViewContainer from "../../client-components/CountAndSortViewContainer";
import PaginationViewContainer from "../../client-components/PaginationViewContainer";
import FilterBar from "../../server-components/FilterBar";
import HeaderViewContainer from "../../client-components/HeaderViewContainer";
import RealEstateIndexPageTitleViewContainer from "../../client-components/RealEstateIndexPageTitleViewContainer";

export const dynamic = "error";

export default function Home() {
  return (
    <Page.Root>
      <ToastHub>
        <Page.Header>
          <HeaderViewContainer full mode="standard" />
          <FilterBar />
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
            <RealEstateIndexPageTitleViewContainer />
            <Page.CountAndSort>
              <CountAndSortViewContainer />
            </Page.CountAndSort>
            <Page.Properties>
              <PropertyGridViewContainer />
            </Page.Properties>
            <Page.Pagination>
              <PaginationViewContainer />
            </Page.Pagination>
          </Page.Content>
          <Page.Map>
            <ListingMapViewContainer />
          </Page.Map>
        </Page.Main>
        <Page.Footer>
          <FooterContainer full />
        </Page.Footer>
      </ToastHub>
    </Page.Root>
  );
}
