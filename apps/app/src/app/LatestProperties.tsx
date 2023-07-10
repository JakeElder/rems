import api from "../api";
import { PropertySlider } from "@rems/ui";
import React from "react";

type Props = {};

const LatestProperties = async ({}: Props) => {
  const latest = await api.get.properties({ sort: "newest-first" });
  return <PropertySlider properties={latest.data} />;
};

export default LatestProperties;
