"use client";

import React from "react";
import { RealEstateIndexPage as Layout } from "@rems/ui";
import { useDomElements } from "@/components/DomElementsProvider";
import PropertyGridViewContainer from "@/components/client/PropertyGridViewContainer";
import CountAndSortViewContainer from "@/components/client/CountAndSortViewContainer";
import PaginationViewContainer from "@/components/client/PaginationViewContainer";
import RealEstateIndexPageTitleViewContainer from "@/components/client/RealEstateIndexPageTitleViewContainer";

type Props = {};

const RealEstateIndexPageContentViewContainer = ({}: Props) => {
  const { $listings } = useDomElements();
  return (
    <Layout.Content ref={$listings}>
      <RealEstateIndexPageTitleViewContainer />
      <Layout.CountAndSort>
        <CountAndSortViewContainer />
      </Layout.CountAndSort>
      <Layout.Properties>
        <PropertyGridViewContainer />
      </Layout.Properties>
      <Layout.Pagination>
        <PaginationViewContainer />
      </Layout.Pagination>
    </Layout.Content>
  );
};

export default RealEstateIndexPageContentViewContainer;
