"use server";

import fetch from "@/fetch";
import TypeFiltersViewContainer from "@/components/client/TypeFiltersViewContainer";

type Props = { id: string };

const TypeFiltersContainer = async ({ id }: Props) => {
  const types = await fetch("property-types");
  return <TypeFiltersViewContainer types={types} id={id} />;
};

export default TypeFiltersContainer;
