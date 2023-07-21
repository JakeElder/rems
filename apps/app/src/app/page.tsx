import { HomePage as Page, ToastHub } from "@rems/ui";
import PopularSearches from "../components/PopularSearches";
import LatestProperties from "../components/LatestProperties";
import Hero from "../components/Hero";
import { Metadata } from "next";
import api from "../api";
import Analytics from "../components/Analytics";
import { Suspense } from "react";
import HeaderViewContainer from "../client-components/HeaderViewContainer";
import MailingListModuleViewContainer from "../client-components/MailingListModuleViewContainer";
import FooterContainer from "../server-components/FooterContainer";

export async function generateMetadata(): Promise<Metadata> {
  const config = await api.get.appConfig();

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
          <Suspense>
            <Hero />
          </Suspense>
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
