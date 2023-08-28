import { GetServerSideProps, NextPage } from "next";
import { Breadcrumbs, RealEstateIndexPage as Layout, ToastHub } from "@rems/ui";
import PropertyGridViewContainer from "@/components/client/PropertyGridViewContainer";
import ListingMapViewContainer from "@/components/client/ListingMapViewContainer";
import CountAndSortViewContainer from "@/components/client/CountAndSortViewContainer";
import PaginationViewContainer from "@/components/client/PaginationViewContainer";
import HeaderViewContainer from "@/components/client/HeaderViewContainer";
import RealEstateIndexPageTitleViewContainer from "@/components/client/RealEstateIndexPageTitleViewContainer";
import FilterBarViewContainer from "@/components/client/FilterBarViewContainer";
import FooterViewContainer from "@/components/client/FooterViewContainer";
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
import fetch from "@/fetch";
import { RealEstateIndexPageStateProvider } from "../hooks/use-real-estate-index-page-state";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";

enableReactUse();

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
        <RealEstateIndexPageStateProvider>
          <Layout.Header>
            <HeaderViewContainer full mode="standard" search={true} />
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
        </RealEstateIndexPageStateProvider>
      </ToastHub>
    </Layout.Root>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [
    config,
    searches,
    quickFilters,
    propertyTypes,
    areas,
    viewTypes,
    indoorFeatures,
    outdoorFeatures,
    lotFeatures,
    mrtStations,
    btsStations
  ] = await Promise.all([
    fetch("app-config"),
    fetch("popular-searches"),
    fetch("quick-filters"),
    fetch("property-types"),
    fetch("areas"),
    fetch("view-types"),
    fetch("indoor-features"),
    fetch("outdoor-features"),
    fetch("lot-features"),
    fetch("mrt-stations"),
    fetch("bts-stations")
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
