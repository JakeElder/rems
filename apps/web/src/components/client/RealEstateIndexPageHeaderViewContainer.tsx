"use client";

import React, { useRef } from "react";
import { RealEstateIndexPage as Layout } from "@rems/ui";
import HeaderViewContainer from "@/components/client/HeaderViewContainer";
import FilterBarViewContainer from "@/components/client/FilterBarViewContainer";
import { useDomElements } from "../DomElementsProvider";
import {
  Area,
  IndoorFeature,
  LotFeature,
  OutdoorFeature,
  PropertyType,
  QuickFilter,
  ViewType
} from "@rems/types";

const RealEstateIndexPageHeaderViewContainer = () => {
  const $header = useRef<HTMLDivElement | null>(null);
  return (
    <Layout.Header ref={$header}>
      <HeaderViewContainer full mode="standard" chat />
      <FilterBarViewContainer />
    </Layout.Header>
  );
};

export default RealEstateIndexPageHeaderViewContainer;
