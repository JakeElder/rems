import { HomePage as Page, ToastHub } from "@rems/ui";
import PopularSearches from "../components/PopularSearches";
import LatestProperties from "../components/LatestProperties";
import { Metadata } from "next";
import fetch from "@/fetch";
import Analytics from "@/components/Analytics";
import HeaderViewContainer from "@/components/client/HeaderViewContainer";
import MailingListModuleViewContainer from "@/components/client/MailingListModuleViewContainer";
import FooterContainer from "@/components/server/FooterContainer";
import FeaturedCarouselContainer from "@/components/server/FeaturedCarouselContainer";

export async function generateMetadata(): Promise<Metadata> {
  const config = await fetch("app-config");

  return {
    title: config.defaultTitle,
    description: config.defaultDescription
  };
}

export default async function Home() {
  return (
    <Page.Root>
      <ToastHub>
        <Analytics />
        <Page.Header>
          <HeaderViewContainer mode="hero" />
        </Page.Header>
        <Page.Hero>
          <FeaturedCarouselContainer />
        </Page.Hero>
        <Page.Content>
          <Page.PopularSearches>
            <PopularSearches />
          </Page.PopularSearches>
          <Page.EmailCollector>
            <MailingListModuleViewContainer />
          </Page.EmailCollector>
          <Page.LatestProperties>
            <LatestProperties />
          </Page.LatestProperties>
        </Page.Content>
        <Page.Footer>
          <FooterContainer />
        </Page.Footer>
      </ToastHub>
    </Page.Root>
  );
}

// export default async function Home() {
//   return (
//     <Page.Root>
//       <ToastHub>
//         <Analytics />
//         <Page.Header>
//           <HeaderViewContainer mode="hero" />
//         </Page.Header>
//         <Page.Hero>
//           <FeaturedCarouselContainer />
//         </Page.Hero>
//         <Page.Content>
//           <Page.PopularSearches>
//             <PopularSearches />
//           </Page.PopularSearches>
//           <Page.EmailCollector>
//             <MailingListModuleViewContainer />
//           </Page.EmailCollector>
//           <Page.LatestProperties>
//             <LatestProperties />
//           </Page.LatestProperties>
//         </Page.Content>
//         <Page.Footer>
//           <FooterContainer />
//         </Page.Footer>
//       </ToastHub>
//     </Page.Root>
//   );
// }
