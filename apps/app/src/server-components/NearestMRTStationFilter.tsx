"use server";

import api from "../api";
import NearestMRTStationFilterViewContainer from "../client-components/NearestMRTStationFilterViewContainer";

type Props = {};

const NearestMRTStationFilterContainer = async ({}: Props) => {
  const stations = await api.get.mrtStations();
  return <NearestMRTStationFilterViewContainer stations={stations} />;
};

export default NearestMRTStationFilterContainer;
