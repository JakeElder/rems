// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import * as Page from "./RealEstateIndexPage";
import Header from "../../Components/Header";
import FilterBar from "../../Components/FilterBar";
import PropertyCard from "../../Components/PropertyCard";
import Pagination from "../../Components/Pagination";
import Footer from "../../Components/Footer";
import ListingMap from "../../Components/ListingMap";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CountAndSort from "../../Components/CountAndSort";

const meta: Meta<typeof Page> = {
  title: "Pages/RealEstateIndexPage",
  parameters: { layout: "fullscreen" }
};

type Story = StoryObj<typeof Page>;

export const Default: Story = {
  render() {
    return (
      <Page.Root>
        <Page.Header>
          <Header full mode="standard" />
          <FilterBar />
        </Page.Header>
        <Page.Main>
          <Page.Content>
            <Page.Breadcrumbs>
              <Breadcrumbs />
            </Page.Breadcrumbs>
            <Page.Title>Homes for sale in Thailand</Page.Title>
            <Page.CountAndSort>
              <CountAndSort />
            </Page.CountAndSort>
            <Page.Properties>
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} link="#" />
              ))}
            </Page.Properties>
            <Page.Pagination>
              <Pagination />
            </Page.Pagination>
          </Page.Content>
          <Page.Map>
            <ListingMap properties={properties} />
          </Page.Map>
        </Page.Main>
        <Page.Footer>
          <Footer full />
        </Page.Footer>
      </Page.Root>
    );
  }
};

export default meta;
