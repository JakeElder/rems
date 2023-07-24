"use server";

import api from "../api";
import NearestBTSStationFilterViewContainer from "../client-components/NearestBTSStationFilterViewContainer";

type Props = {};

const NearestBTSStationFilterContainer = async ({}: Props) => {
  const stations = await api.get.btsStations();
  return <NearestBTSStationFilterViewContainer stations={stations} />;
};

export default NearestBTSStationFilterContainer;
