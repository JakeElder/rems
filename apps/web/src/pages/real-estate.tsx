import "regenerator-runtime";
import { GetServerSideProps, NextPage } from "next";
import { RealEstateIndexPage as Layout, ToastHub } from "@rems/ui";
import ListingMapViewContainer from "@/components/client/ListingMapViewContainer";
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
import ChatViewContainer from "@/components/client/ChatViewContainer";
import AssistantProvider from "@/components/AssistantProvider";
import DomElementsProvider from "@/components/DomElementsProvider";
import RealEstateIndexPageHeaderViewContainer from "@/components/client/RealEstateIndexPageHeaderViewContainer";
import RealEstateIndexPageContentViewContainer from "@/components/client/RealEstateIndexPageContentViewContainer";

enableReactUse();

export type FilterBarProps = {
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

type Props = {
  config: AppConfig;
  searches: FilterSet[];
} & FilterBarProps;

const Page: NextPage<Props> = ({ searches, config, ...filterBarProps }) => {
  return (
    <Layout.Root>
      <RealEstateIndexPageStateProvider>
        <AssistantProvider>
          <DomElementsProvider>
            <ChatViewContainer />
            <ToastHub>
              <RealEstateIndexPageHeaderViewContainer
                filterBarProps={filterBarProps}
              />
              <Layout.Main>
                <RealEstateIndexPageContentViewContainer />
                <Layout.Map>
                  <ListingMapViewContainer />
                </Layout.Map>
              </Layout.Main>
              <Layout.Footer>
                <FooterViewContainer config={config} searches={searches} full />
              </Layout.Footer>
            </ToastHub>
          </DomElementsProvider>
        </AssistantProvider>
      </RealEstateIndexPageStateProvider>
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
