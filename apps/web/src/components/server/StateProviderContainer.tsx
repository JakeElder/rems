import { SearchParams } from "@rems/types";
import StateProvider from "../client/StateProvider";
import { fromSearchParams } from "@rems/utils/query";
import fetch from "@/fetch";

type Props = {
  children: React.ReactNode;
  searchParams?: SearchParams;
};

const StateProviderContainer = async ({ searchParams, children }: Props) => {
  const [
    propertyTypes,
    viewTypes,
    indoorFeatures,
    outdoorFeatures,
    lotFeatures
  ] = await Promise.all([
    fetch("property-types"),
    fetch("view-types"),
    fetch("indoor-features"),
    fetch("outdoor-features"),
    fetch("lot-features")
  ]);

  const query = fromSearchParams(searchParams || {}, {
    propertyTypes,
    viewTypes,
    outdoorFeatures,
    indoorFeatures,
    lotFeatures
  });

  return <StateProvider children={children} query={query} />;
};

export default StateProviderContainer;
