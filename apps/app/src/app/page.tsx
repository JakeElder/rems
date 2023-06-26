import { HomePage } from "@rems/ui/src";
import api from "../api";

export default async function Home() {
  const { ids } = await api.query.featuredProperties();
  const properties = await api.get.properties(...ids);
  const withImages = properties.filter((p) => !!p.images.length);
  return <HomePage heroProperties={withImages} />;
}
