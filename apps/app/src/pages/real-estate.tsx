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
import {
  AppConfig,
  Area,
  BTSStation,
  FilterSet,
  IndoorFeature,
  LotFeature,
  MRTStation,
  OutdoorFeature,
  PropertyType,
  QuickFilter,
  ViewType
} from "@rems/types";
import api from "../api";

type Props = {
  config: AppConfig;
  searches: FilterSet[];
  propertyTypes: PropertyType[];
  areas: Area[];
  viewTypes: ViewType[];
  indoorFeatures: IndoorFeature[];
  outdoorFeatures: OutdoorFeature[];
  lotFeatures: LotFeature[];
  mrtStations: MRTStation[];
  btsStations: BTSStation[];
  quickFilters: QuickFilter[];
};

const Page: NextPage<Props> = ({ searches, config, ...filterBarProps }) => {
  return (
    <Layout.Root>
      <ToastHub>
        <Layout.Header>
          <HeaderViewContainer full mode="standard" />
          <FilterBarViewContainer {...filterBarProps} />
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
  const [
    config,
    searches,
    propertyTypes,
    areas,
    viewTypes,
    indoorFeatures,
    outdoorFeatures,
    lotFeatures,
    mrtStations,
    btsStations,
    quickFilters
  ] = await Promise.all([
    api.get.appConfig(),
    api.get.popularSearches(),
    api.get.propertyTypes(),
    api.get.areas(),
    api.get.viewTypes(),
    api.get.indoorFeatures(),
    api.get.outdoorFeatures(),
    api.get.lotFeatures(),
    api.get.mrtStations(),
    api.get.btsStations(),
    api.get.quickFilters()
  ]);

  return {
    props: {
      config,
      searches,
      propertyTypes,
      areas,
      viewTypes,
      indoorFeatures,
      outdoorFeatures,
      lotFeatures,
      mrtStations,
      btsStations,
      quickFilters
    }
  };
};

export default Page;
