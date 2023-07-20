"use server";

import api from "../api";
import LotFeatureFiltersViewContainer from "../client-components/LotFeatureFiltersViewContainer";

type Props = {};

const LotFeatureFiltersContainer = async ({}: Props) => {
  const features = await api.get.lotFeatures();
  return <LotFeatureFiltersViewContainer features={features} />;
};

export default LotFeatureFiltersContainer;
