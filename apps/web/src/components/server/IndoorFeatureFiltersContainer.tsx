"use server";

import fetch from "@/fetch";
import IndoorFeatureFiltersViewContainer from "@/components/client/IndoorFeatureFiltersViewContainer";

type Props = {};

const IndoorFeatureFiltersContainer = async ({ }: Props) => {
  const features = await fetch("indoor-features");
  return <IndoorFeatureFiltersViewContainer features={features} />;
};

export default IndoorFeatureFiltersContainer;
