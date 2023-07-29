import React from "react";
import { PropertySlider } from "@rems/ui";
import fetch from "@/fetch";

type Props = {};

const LatestProperties = async ({}: Props) => {
  const { data: properties } = await fetch("properties", {
    sort: "newest-first"
  });
  console.log(properties[0].images)
  return <PropertySlider properties={properties} />;
};

export default LatestProperties;
