import React from "react";
import { PropertySlider } from "@rems/ui";
import fetch from "@/fetch";

type Props = {};

const LatestProperties = async ({}: Props) => {
  const { data: properties } = await fetch("properties", {
    pageAndSort: {
      sort: "NEWEST_FIRST",
      page: 1
    }
  });
  return <PropertySlider properties={properties} />;
};

export default LatestProperties;
