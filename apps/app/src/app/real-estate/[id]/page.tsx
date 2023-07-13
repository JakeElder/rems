import {
  RealEstatePage as Page,
  Header,
  SimpleImageCarousel,
  Breadcrumbs,
  ContactAgentForm,
  AskAQuestionForm,
  ContactAgentModule
} from "@rems/ui";
import api from "../../../api";
import { Metadata } from "next";
import { SearchParams } from "@rems/types";
import Footer from "../../../components/Footer";
import { headers } from "next/headers";
import Analytics from "../../../components/Analytics";

type Props = {
  params: { id: string };
  searchParams: SearchParams;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parts = params.id.split("-");
  const property = await api.get.property(parts[parts.length - 1]);

  return {
    title: property.title,
    description: property.description
  };
}

export const revalidate = 0;

function generateBackLink(referer: string | null) {
  if (!referer) {
    return null;
  }

  const url = new URL(referer);
  if (url.pathname !== "/real-estate") {
    return null;
  }

  return `${url.pathname}${url.search}`;
}

export default async function RealEstatePage({ params }: Props) {
  const parts = params.id.split("-");
  const property = await api.get.property(parts[parts.length - 1]);
  const images = property.images.map((i) => ({
    ...i,
    alt: property.title
  }));

  const headersList = headers();
  const backHref = generateBackLink(headersList.get("referer"));

  return (
    <Page.Root>
      <Analytics />
      <Page.Header>
        <Header mode="hero" backHref={backHref} />
      </Page.Header>
      <Page.Carousel>
        <SimpleImageCarousel images={images} fill />
      </Page.Carousel>
      <Page.Content>
        <Page.Main>
          <Page.Breadcrumbs>
            <Breadcrumbs
              items={[
                { children: "Home", href: "/" },
                { children: "Real Estate", href: "/real-estate" },
                { children: property.title, href: property.url }
              ]}
            />
          </Page.Breadcrumbs>
          <Page.TitleAndDescription property={property} />
          <Page.Features property={property} />
          <Page.ContactAgent>
            <ContactAgentForm />
          </Page.ContactAgent>
          <Page.AskAQuestion>
            <AskAQuestionForm />
          </Page.AskAQuestion>
          <Page.TheArea property={property} />
        </Page.Main>
        <Page.Contact hasBackHref={!!backHref}>
          <ContactAgentModule />
        </Page.Contact>
      </Page.Content>
      <Page.Footer>
        <Footer />
      </Page.Footer>
    </Page.Root>
  );
}
