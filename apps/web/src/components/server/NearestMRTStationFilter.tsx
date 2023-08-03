"use server";

import fetch from "@/fetch";
import NearestMRTStationFilterViewContainer from "@/components/client/NearestMRTStationFilterViewContainer";

type Props = {};

const NearestMRTStationFilterContainer = async ({ }: Props) => {
  const stations = await fetch("mrt-stations");
  return <NearestMRTStationFilterViewContainer stations={stations} />;
};

export default NearestMRTStationFilterContainer;
