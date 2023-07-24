"use server";

import api from "../api";
import AreaFilterViewContainer from "../client-components/AreaFilterViewContainer";

type Props = {};

const AreaFilterContainer = async ({}: Props) => {
  const areas = await api.get.areas();
  return <AreaFilterViewContainer areas={areas} />;
};

export default AreaFilterContainer;
