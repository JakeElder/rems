"use server";

import api from "../../api";
import LotFeatureFiltersViewContainer from "@/components/client/LotFeatureFiltersViewContainer";

type Props = {};

const LotFeatureFiltersContainer = async ({}: Props) => {
  const features = await api.get.lotFeatures();
  return <LotFeatureFiltersViewContainer features={features} />;
};

export default LotFeatureFiltersContainer;
