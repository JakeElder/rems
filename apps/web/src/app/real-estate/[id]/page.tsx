import {
  RealEstatePage as Page,
  Breadcrumbs as BreadcrumbsView,
  ToastHub,
  HeroCarousel
} from "@rems/ui";
import { Metadata } from "next";
import { Property, SearchParams } from "@rems/types";
import Analytics from "@/components/Analytics";
import ContactAgentModuleContainer from "@/components/server/ContactAgentModuleContainer";
import FooterContainer from "@/components/server/FooterContainer";
import AskAQuestionFormContainer from "@/components/server/AskAQuestionFormContainer";
import HeaderViewContainer from "@/components/client/HeaderViewContainer";
import fetch from "@/fetch";

type Props = {
  params: { id: string };
  searchParams: SearchParams;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parts = params.id.split("-");
  const id = parseInt(parts[parts.length - 1], 10);
  const property = await fetch("property", id);

  return {
    title: property.title,
    description: property.description
  };
}

const Breadcrumbs = async ({ propertyId }: { propertyId: Property["id"] }) => {
  const property = await fetch("property", propertyId);
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
  const property = await fetch("property", propertyId);
  return <Page.TitleAndDescription property={property} />;
};

const Features = async ({ propertyId }: { propertyId: Property["id"] }) => {
  const [indoor, outdoor, lot, view] = await Promise.all([
    fetch("properties/[id]/indoor-features", propertyId),
    fetch("properties/[id]/outdoor-features", propertyId),
    fetch("properties/[id]/lot-features", propertyId),
    fetch("properties/[id]/view-types", propertyId)
  ]);
  return <Page.Features features={[...indoor, ...outdoor, ...lot, ...view]} />;
};

const TheArea = async ({ propertyId }: { propertyId: Property["id"] }) => {
  const property = await fetch("property", propertyId);
  const images = await fetch("properties/[id]/images", propertyId);
  return <Page.TheArea property={property} image={images[0]} />;
};

const Carousel = async ({ propertyId }: { propertyId: Property["id"] }) => {
  const images = await fetch("properties/[id]/images", propertyId);
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
