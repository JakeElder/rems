import { SearchParams } from "@rems/types";
import StateProvider from "../client/StateProvider";
import { fromSearchParams } from "@rems/utils/query";
import fetch from "@/fetch";

type Props = {
  children: React.ReactNode;
  searchParams?: SearchParams;
};

const StateProviderContainer = async ({ searchParams, children }: Props) => {
  const filters = await fetch("array-filters");
  const query = fromSearchParams(searchParams || {}, filters);

  return <StateProvider children={children} query={query} />;
};

export default StateProviderContainer;
