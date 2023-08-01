"use server";

import fetch from "@/fetch";
import LotFeatureFiltersViewContainer from "@/components/client/LotFeatureFiltersViewContainer";

type Props = {};

const LotFeatureFiltersContainer = async ({ }: Props) => {
  const features = await fetch("lot-features");
  return <LotFeatureFiltersViewContainer features={features} />;
};

export default LotFeatureFiltersContainer;
