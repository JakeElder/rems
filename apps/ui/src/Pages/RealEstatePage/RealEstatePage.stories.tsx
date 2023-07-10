import type { Meta, StoryObj } from "@storybook/react";
import * as Page from "./RealEstatePage";
import properties from "../../fixtures/properties";
import Header from "../../Components/Header";
import SimpleImageCarousel from "../../Components/SimpleImageCarousel";
import Breadcrumbs from "../../Components/Breadcrumbs";
import ContactAgentForm from "../../Components/ContactAgentForm";
import AskAQuestionForm from "../../Components/AskAQuestionForm";
import ContactAgentModule from "../../Components/ContactAgentModule";

const meta: Meta = {
  title: "Pages/RealEstatePage",
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj;

const property = properties[1];
const images = property.images.map((i) => ({
  ...i,
  alt: property.title
}));

export const Default: Story = {
  render() {
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
};

export default meta;
