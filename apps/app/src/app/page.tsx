import { FeaturedHero } from "@rems/ui";
import api from "../api";

export default async function Home() {
  const { ids } = await api.query.featuredProperties();
  const properties = await api.get.properties(...ids);

  const withImages = properties.filter((p) => !!p.images.length);

  return (
    <main>
      <FeaturedHero theme="light" properties={withImages} />
    </main>
  );
}
