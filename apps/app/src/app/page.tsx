import { HomePage as Page, Header } from "@rems/ui";
import PopularSearches from "./PopularSearches";
import LatestProperties from "./LatestProperties";
import Hero from "./Hero";
import EmailCollector from "./EmailCollector";

export default async function Home() {
  return (
    <Page.Root>
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
      <Page.Footer />
    </Page.Root>
  );
}
