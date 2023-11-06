"use client";

import React from "react";
import { RealEstateIndexPage as Layout } from "@rems/ui";
import useDomElements from "@/hooks/use-dom-elements";

type Props = {
  children: React.ReactNode;
};

const RealEstateIndexPageHeaderViewContainer = ({ children }: Props) => {
  const { $header } = useDomElements();
  return <Layout.Header ref={$header}>{children}</Layout.Header>;
};

export default RealEstateIndexPageHeaderViewContainer;
