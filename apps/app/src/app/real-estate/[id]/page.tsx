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

export default async function Home({ params }: Props) {
  const parts = params.id.split("-");
  const property = await api.get.property(parts[parts.length - 1]);
  const images = property.images.map((i) => ({
    ...i,
    alt: property.title
  }));

  return (
    <Page.Root>
      <Page.Header>
        <Header mode="hero" />
      </Page.Header>
      <Page.Carousel>
        <SimpleImageCarousel images={images} fill />
      </Page.Carousel>
      <Page.Content>
        <Page.Main>
          <Page.Breadcrumbs>
            <Breadcrumbs />
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
        <Page.Contact>
          <ContactAgentModule />
        </Page.Contact>
      </Page.Content>
      <Page.Footer>
        <Footer />
      </Page.Footer>
    </Page.Root>
  );
}
