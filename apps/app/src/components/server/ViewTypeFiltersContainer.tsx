"use server";

import api from "@/api";
import ViewTypeFiltersViewContainer from "@/components/client/ViewTypeFiltersViewContainer";

type Props = {};

const ViewTypeFiltersContainer = async ({}: Props) => {
  const types = await api.get.viewTypes();
  return <ViewTypeFiltersViewContainer types={types} />;
};

export default ViewTypeFiltersContainer;
