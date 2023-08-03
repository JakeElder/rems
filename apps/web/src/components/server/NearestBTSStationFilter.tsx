"use server";

import fetch from "@/fetch";
import NearestBTSStationFilterViewContainer from "@/components/client/NearestBTSStationFilterViewContainer";

type Props = {};

const NearestBTSStationFilterContainer = async ({ }: Props) => {
  const stations = await fetch("bts-stations");
  return <NearestBTSStationFilterViewContainer stations={stations} />;
};

export default NearestBTSStationFilterContainer;
