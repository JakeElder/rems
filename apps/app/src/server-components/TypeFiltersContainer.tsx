'use server'

import api from "../api";
import TypeFiltersViewContainer from "../client-components/TypeFiltersViewContainer";

type Props = { id: string };

const TypeFiltersContainer = async ({ id }: Props) => {
  const types = await api.get.propertyTypes();
  return <TypeFiltersViewContainer types={types} id={id} />;
};

export default TypeFiltersContainer;
