"use client";

import React from "react";
import { RealEstateIndexPage as Layout } from "@rems/ui";
import HeaderViewContainer from "@/components/client/HeaderViewContainer";
import FilterBarViewContainer from "@/components/client/FilterBarViewContainer";
import { FilterBarProps } from "pages/real-estate";
import { useDomElements } from "../DomElementsProvider";

type Props = {
  filterBarProps: FilterBarProps;
};

const RealEstateIndexPageHeaderViewContainer = ({ filterBarProps }: Props) => {
  const { $header } = useDomElements();
  return (
    <Layout.Header ref={$header}>
      <HeaderViewContainer full mode="standard" chat />
      <FilterBarViewContainer {...filterBarProps} />
    </Layout.Header>
  );
};

export default RealEstateIndexPageHeaderViewContainer;
