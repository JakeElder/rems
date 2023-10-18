import { Metadata } from "next";
import { RealEstateIndexPage as Page, ToastHub } from "@rems/ui";
import ListingMapViewContainer from "@/components/client/ListingMapViewContainer";
import FooterViewContainer from "@/components/client/FooterViewContainer";
import fetch from "@/fetch";
import { RealEstateIndexPageStateProvider } from "@/hooks/use-real-estate-index-page-state";
// import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import ChatViewContainer from "@/components/client/ChatViewContainer";
import AssistantProvider from "@/components/AssistantProvider";
import DomElementsProvider from "@/components/DomElementsProvider";
import RealEstateIndexPageHeaderViewContainer from "@/components/client/RealEstateIndexPageHeaderViewContainer";
import RealEstateIndexPageContentViewContainer from "@/components/client/RealEstateIndexPageContentViewContainer";
import { zodToJsonSchema } from "zod-to-json-schema";

import { UrlRealEstateQuerySchema, RealEstateQuerySchema } from "@rems/schemas";

console.dir(zodToJsonSchema(RealEstateQuerySchema), {
  depth: null,
  colors: true
});

// enableReactUse();

export async function generateMetadata(): Promise<Metadata> {
  const config = await fetch("app-config");
  return {
    title: config.defaultTitle,
    description: config.defaultDescription
  };
}

export default async function RealEstateIndexPage() {
  const [
    config,
    searches,
    quickFilters,
    propertyTypes,
    areas,
    viewTypes,
    indoorFeatures,
    outdoorFeatures,
    lotFeatures
  ] = await Promise.all([
    fetch("app-config"),
    fetch("popular-searches"),
    fetch("quick-filters"),
    fetch("property-types"),
    fetch("areas"),
    fetch("view-types"),
    fetch("indoor-features"),
    fetch("outdoor-features"),
    fetch("lot-features")
  ]);

  return <Page.Root>hellow world</Page.Root>;

  // return (
  //   <Page.Root>
  //     <RealEstateIndexPageStateProvider>
  //       <DomElementsProvider>
  //         <AssistantProvider>
  //           <ChatViewContainer />
  //           <ToastHub>
  //             <RealEstateIndexPageHeaderViewContainer
  //               filterBarProps={{
  //                 quickFilters,
  //                 propertyTypes,
  //                 areas,
  //                 viewTypes,
  //                 indoorFeatures,
  //                 outdoorFeatures,
  //                 lotFeatures
  //               }}
  //             />
  //             <Page.Main>
  //               <RealEstateIndexPageContentViewContainer />
  //               <Page.Map>
  //                 <ListingMapViewContainer />
  //               </Page.Map>
  //             </Page.Main>
  //             <Page.Footer>
  //               <FooterViewContainer config={config} searches={searches} full />
  //             </Page.Footer>
  //           </ToastHub>
  //         </AssistantProvider>
  //       </DomElementsProvider>
  //     </RealEstateIndexPageStateProvider>
  //   </Page.Root>
  // );
}
