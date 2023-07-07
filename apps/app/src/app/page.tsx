import { HomePage } from "@rems/ui";
import api from "../api";

export default async function Home() {
  const properties = await api.get.featuredProperties();
  const withImages = properties.filter((p) => !!p.images.length);
  return <HomePage heroProperties={withImages} />;
}
