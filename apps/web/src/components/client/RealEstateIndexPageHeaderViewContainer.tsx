"use client";

import React from "react";
import { RealEstateIndexPage as Layout } from "@rems/ui";
import { useDomElements } from "@/components/client/DomElementsProvider";

type Props = {
  children: React.ReactNode;
};

const RealEstateIndexPageHeaderViewContainer = ({ children }: Props) => {
  const { $header } = useDomElements();
  return <Layout.Header ref={$header}>{children}</Layout.Header>;
};

export default RealEstateIndexPageHeaderViewContainer;
