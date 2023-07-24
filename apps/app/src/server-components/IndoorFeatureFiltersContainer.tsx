"use server";

import api from "../api";
import IndoorFeatureFiltersViewContainer from "../client-components/IndoorFeatureFiltersViewContainer";

type Props = {};

const IndoorFeatureFiltersContainer = async ({}: Props) => {
  const features = await api.get.indoorFeatures();
  return <IndoorFeatureFiltersViewContainer features={features} />;
};

export default IndoorFeatureFiltersContainer;
