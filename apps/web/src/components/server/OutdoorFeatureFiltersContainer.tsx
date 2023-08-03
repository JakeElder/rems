"use server";

import fetch from "@/fetch";
import OutdoorFeatureFiltersViewContainer from "@/components/client/OutdoorFeatureFiltersViewContainer";

type Props = {};

const OutdoorFeatureFiltersContainer = async ({ }: Props) => {
  const features = await fetch("outdoor-features");
  return <OutdoorFeatureFiltersViewContainer features={features} />;
};

export default OutdoorFeatureFiltersContainer;
