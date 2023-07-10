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

export default async function Home({ params }: any) {
  const property = await api.get.property(params.id.split("-").slice(-1));
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
      <Page.Footer />
    </Page.Root>
  );
}
