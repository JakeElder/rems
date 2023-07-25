import { GetStaticProps, NextPage } from "next";
import { Breadcrumbs, RealEstateIndexPage as Layout, ToastHub } from "@rems/ui";
import PropertyGridViewContainer from "../client-components/PropertyGridViewContainer";
import ListingMapViewContainer from "../client-components/ListingMapViewContainer";
import CountAndSortViewContainer from "../client-components/CountAndSortViewContainer";
import PaginationViewContainer from "../client-components/PaginationViewContainer";
import HeaderViewContainer from "../client-components/HeaderViewContainer";
import RealEstateIndexPageTitleViewContainer from "../client-components/RealEstateIndexPageTitleViewContainer";
import FilterBarViewContainer from "../client-components/FilterBarViewContainer";
import FooterViewContainer from "../client-components/FooterViewContainer";
import { AppConfig, FilterSet } from "@rems/types";
import api from "../api";

type Props = {
  config: AppConfig;
  searches: FilterSet[];
};

const Page: NextPage<Props> = ({ searches, config, ...props }, p) => {
  console.log(props, p);
  return (
    <Layout.Root>
      <ToastHub>
        <Layout.Header>
          <HeaderViewContainer full mode="standard" />
        </Layout.Header>
        <Layout.Main>
          <Layout.Content>
            <Layout.Breadcrumbs>
              <Breadcrumbs
                items={[
                  { children: "Home", href: "/" },
                  { children: "Real Estate", href: "/real-estate" }
                ]}
              />
            </Layout.Breadcrumbs>
            <RealEstateIndexPageTitleViewContainer />
            <Layout.CountAndSort>
              <CountAndSortViewContainer />
            </Layout.CountAndSort>
            <Layout.Properties>
              <PropertyGridViewContainer />
            </Layout.Properties>
            <Layout.Pagination>
              <PaginationViewContainer />
            </Layout.Pagination>
          </Layout.Content>
          <Layout.Map>
            <ListingMapViewContainer />
          </Layout.Map>
        </Layout.Main>
        <Layout.Footer>
          <FooterViewContainer config={config} searches={searches} full />
        </Layout.Footer>
      </ToastHub>
    </Layout.Root>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [config, searches] = await Promise.all([
    api.get.appConfig(),
    api.get.popularSearches()
  ]);

  return {
    props: {
      config,
      searches
    }
  };
};

export default Page;
