"use client";

import React from "react";
import { RealEstateIndexPage as Layout } from "@rems/ui";
import useDomElements from "@/hooks/use-dom-elements";

type Props = {
  children: React.ReactNode;
};

const RealEstateIndexPageContentViewContainer = ({ children }: Props) => {
  const { $listings } = useDomElements();
  return <Layout.Content ref={$listings}>{children}</Layout.Content>;
};

export default RealEstateIndexPageContentViewContainer;
