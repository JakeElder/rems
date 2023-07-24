import {
  RealEstatePage as Page,
  Breadcrumbs as BreadcrumbsView,
  ToastHub,
  HeroCarousel
} from "@rems/ui";
import api from "../../../api";
import { Metadata } from "next";
import { Property, SearchParams } from "@rems/types";
import Analytics from "../../../components/Analytics";
import HeaderViewContainer from "../../../client-components/HeaderViewContainer";
import ContactAgentModuleContainer from "../../../server-components/ContactAgentModuleContainer";
import FooterContainer from "../../../server-components/FooterContainer";
import AskAQuestionFormContainer from "../../../server-components/AskAQuestionFormContainer";

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
  if (!property.location) {
    return null;
  }
  return <Page.TheArea property={property} />;
};

const Carousel = async ({ propertyId }: { propertyId: Property["id"] }) => {
  const property = await api.get.property(propertyId);
  const images = property.images.map((i) => ({ ...i, alt: property.title }));
  return <HeroCarousel images={images} />;
};

export default async function RealEstatePage({ params }: Props) {
  const parts = params.id.split("-");
  const id = parseInt(parts[parts.length - 1], 10);

  return (
    <Page.Root>
      <ToastHub>
        <Analytics />
        <Page.Header>
          <HeaderViewContainer mode="hero" />
        </Page.Header>
        <Page.Carousel>
          <Carousel propertyId={id} />
        </Page.Carousel>
        <Page.Content>
          <Page.Main>
            <Page.Breadcrumbs>
              <Breadcrumbs propertyId={id} />
            </Page.Breadcrumbs>
            <TitleAndDescription propertyId={id} />
            <Features propertyId={id} />
            <Page.AskAQuestion>
              <AskAQuestionFormContainer propertyId={id} />
            </Page.AskAQuestion>
            <TheArea propertyId={id} />
          </Page.Main>
          <Page.Contact hasBackHref={false}>
            <ContactAgentModuleContainer propertyId={id} />
          </Page.Contact>
        </Page.Content>
        <Page.Footer>
          <FooterContainer />
        </Page.Footer>
      </ToastHub>
    </Page.Root>
  );
}
