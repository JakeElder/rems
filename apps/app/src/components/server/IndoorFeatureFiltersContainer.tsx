"use server";

import api from "@/api";
import IndoorFeatureFiltersViewContainer from "@/components/client/IndoorFeatureFiltersViewContainer";

type Props = {};

const IndoorFeatureFiltersContainer = async ({}: Props) => {
  const features = await api.get.indoorFeatures();
  return <IndoorFeatureFiltersViewContainer features={features} />;
};

export default IndoorFeatureFiltersContainer;
