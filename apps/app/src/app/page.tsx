import { HomePage as Page, Header } from "@rems/ui";
import PopularSearches from "./PopularSearches";
import LatestProperties from "./LatestProperties";
import Hero from "./Hero";
import EmailCollector from "./EmailCollector";
import { Metadata } from "next";
import api from "../api";
import Footer from "../components/Footer";
import Analytics from "../components/Analytics";

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
        <Hero />
      </Page.Hero>
      <Page.Content>
        <Page.PopularSearches>
          <PopularSearches />
        </Page.PopularSearches>
        <Page.EmailCollector>
          <EmailCollector />
        </Page.EmailCollector>
        <Page.LatestProperties>
          <LatestProperties />
        </Page.LatestProperties>
      </Page.Content>
      <Page.Footer>
        <Footer />
      </Page.Footer>
    </Page.Root>
  );
}
