import api from "../api";

export default async function Home() {
  const { ids } = await api.query.featuredProperties();
  const properties = await api.get.properties(...ids);

  // const withImages = properties.filter((p) => !!p.images.length);

  console.log(JSON.stringify(properties));
  return (
    <main>
      <pre>{JSON.stringify(properties, null, 2)}</pre>
    </main>
  );
}
