import { MapHero } from "@rems/ui";
import api from "../../api";

export default async function Home() {
  const { ids } = await api.query.featuredProperties();
  const properties = await api.get.properties(...ids);

  console.log(JSON.stringify(properties, null));

  return (
    <main>
      <MapHero theme="light" properties={properties} />
    </main>
  );
}
