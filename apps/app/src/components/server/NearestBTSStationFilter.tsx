"use server";

import api from "../../api";
import NearestBTSStationFilterViewContainer from "@/components/client/NearestBTSStationFilterViewContainer";

type Props = {};

const NearestBTSStationFilterContainer = async ({}: Props) => {
  const stations = await api.get.btsStations();
  return <NearestBTSStationFilterViewContainer stations={stations} />;
};

export default NearestBTSStationFilterContainer;
