import { RealEstateIndexPage } from "@rems/ui/src";
import api from "../../api";

export default async function Home() {
  const { ids } = await api.query.properties();
  const properties = await api.get.properties(...ids);

  return <RealEstateIndexPage properties={properties} />;
}
