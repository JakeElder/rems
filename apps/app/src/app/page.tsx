import {
  HomePage as Page,
  Header,
  MailingListModule,
  ServerActionProvider,
  ToastHub
} from "@rems/ui";
import PopularSearches from "../components/PopularSearches";
import LatestProperties from "../components/LatestProperties";
import Hero from "../components/Hero";
import { Metadata } from "next";
import api from "../api";
import Footer from "../components/Footer";
import Analytics from "../components/Analytics";
import { Suspense } from "react";
import { submitContactForm, submitMailingListForm } from "./actions";
import { ServerActions } from "@rems/types";

export async function generateMetadata(): Promise<Metadata> {
  const config = await api.get.appConfig();

  return {
    title: config.defaultTitle,
    description: config.defaultDescription
  };
}

const serverActions: Partial<ServerActions> = {
  "submit-contact-form": submitContactForm,
  "submit-mailing-list-form": submitMailingListForm
};

export default async function Home() {
  return (
    <Page.Root>
      <ToastHub>
        <Analytics />
        <Page.Header>
          <ServerActionProvider value={serverActions}>
            <Header mode="hero" />
          </ServerActionProvider>
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
            <ServerActionProvider value={serverActions}>
              <MailingListModule />
            </ServerActionProvider>
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
      </ToastHub>
    </Page.Root>
  );
}
