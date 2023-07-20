"use server";

import api from "../api";
import OutdoorFeatureFiltersViewContainer from "../client-components/OutdoorFeatureFiltersViewContainer";

type Props = {};

const OutdoorFeatureFiltersContainer = async ({}: Props) => {
  const features = await api.get.outdoorFeatures();
  return <OutdoorFeatureFiltersViewContainer features={features} />;
};

export default OutdoorFeatureFiltersContainer;
