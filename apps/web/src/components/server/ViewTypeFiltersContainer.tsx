"use server";

import fetch from "@/fetch";
import ViewTypeFiltersViewContainer from "@/components/client/ViewTypeFiltersViewContainer";

type Props = {};

const ViewTypeFiltersContainer = async ({ }: Props) => {
  const types = await fetch("view-types");
  return <ViewTypeFiltersViewContainer types={types} />;
};

export default ViewTypeFiltersContainer;
