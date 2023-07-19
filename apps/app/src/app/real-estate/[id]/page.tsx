import {
  RealEstatePage as Page,
  Header,
  Breadcrumbs as BreadcrumbsView,
  ServerActionProvider,
  ToastHub,
  HeroCarousel
} from "@rems/ui";
import api from "../../../api";
import { Metadata } from "next";
import { Property, SearchParams, ServerActions } from "@rems/types";
import Footer from "../../../components/Footer";
import { cookies } from "next/headers";
import Analytics from "../../../components/Analytics";
import { Suspense } from "react";
import ContactAgentModule from "../../../components/ContactAgentModule";
import { submitContactForm } from "../../actions";
import AskAQuestionForm from "../../../components/AskAQuestionForm";

type Props = {
  params: { id: string };
  searchParams: SearchParams;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parts = params.id.split("-");
  const id = parseInt(parts[parts.length - 1], 10);
  const property = await api.get.property(id);

  return {
    title: property.title,
    description: property.description
  };
}

const Breadcrumbs = async ({ propertyId }: { propertyId: Property["id"] }) => {
  const property = await api.get.property(propertyId);
  return (
    <BreadcrumbsView
      items={[
        { children: "Home", href: "/" },
        { children: "Real Estate", href: "/real-estate" },
        { children: property.title, href: property.url }
      ]}
    />
  );
};

const TitleAndDescription = async ({
  propertyId
}: {
  propertyId: Property["id"];
}) => {
  const property = await api.get.property(propertyId);
  return <Page.TitleAndDescription property={property} />;
};

const Features = async ({ propertyId }: { propertyId: Property["id"] }) => {
  const property = await api.get.property(propertyId);
  return <Page.Features property={property} />;
};

const TheArea = async ({ propertyId }: { propertyId: Property["id"] }) => {
  const property = await api.get.property(propertyId);
  return <Page.TheArea property={property} />;
};

const Carousel = async ({ propertyId }: { propertyId: Property["id"] }) => {
  const property = await api.get.property(propertyId);
  const images = property.images.map((i) => ({ ...i, alt: property.title }));
  return <HeroCarousel images={images} />;
};

export const revalidate = 0;

export default async function RealEstatePage({ params }: Props) {
  const parts = params.id.split("-");
  const id = parseInt(parts[parts.length - 1], 10);

  const backHref = cookies().get("referer");

  const serverActions: Partial<ServerActions> = {
    "submit-contact-form": submitContactForm
  };

  return (
    <Page.Root>
      <ToastHub>
        <Analytics />
        <Page.Header>
          <ServerActionProvider value={serverActions}>
            <Header mode="hero" back={true} backHref={backHref?.value} />
          </ServerActionProvider>
        </Page.Header>
        <Page.Carousel>
          <Suspense>
            <Carousel propertyId={id} />
          </Suspense>
        </Page.Carousel>
        <Page.Content>
          <Page.Main>
            <Page.Breadcrumbs>
              <Suspense>
                <Breadcrumbs propertyId={id} />
              </Suspense>
            </Page.Breadcrumbs>
            <Suspense>
              <TitleAndDescription propertyId={id} />
            </Suspense>
            <Features propertyId={id} />
            <Page.AskAQuestion>
              <ServerActionProvider value={serverActions}>
                <AskAQuestionForm propertyId={id} />
              </ServerActionProvider>
            </Page.AskAQuestion>
            <Suspense>
              <TheArea propertyId={id} />
            </Suspense>
          </Page.Main>
          <Page.Contact hasBackHref={!!backHref}>
            <ServerActionProvider value={serverActions}>
              <ContactAgentModule propertyId={id} />
            </ServerActionProvider>
          </Page.Contact>
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
