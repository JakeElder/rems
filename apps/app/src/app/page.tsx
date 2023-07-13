import { HomePage as Page, Header } from "@rems/ui";
import PopularSearches from "./PopularSearches";
import LatestProperties from "./LatestProperties";
import Hero from "./Hero";
import EmailCollector from "./EmailCollector";
import { Metadata } from "next";
import api from "../api";
import Footer from "../components/Footer";
import Analytics from "../components/Analytics";
import { Suspense } from "react";

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
      <Analytics />
      <Page.Header>
        <Header mode="hero" />
      </Page.Header>
      <Page.Hero>
        <Suspense>
          <Hero />
        </Suspense>
      </Page.Hero>
      <Page.Content>
        <Page.PopularSearches>
          <Suspense>
            <PopularSearches />
          </Suspense>
        </Page.PopularSearches>
        <Page.EmailCollector>
          <EmailCollector />
        </Page.EmailCollector>
        <Page.LatestProperties>
          <Suspense>
            <LatestProperties />
          </Suspense>
        </Page.LatestProperties>
      </Page.Content>
      <Page.Footer>
        <Suspense>
          <Footer />
        </Suspense>
      </Page.Footer>
    </Page.Root>
  );
}
