import styles from "./page.module.css";

async function fetchProperty(id: number) {
  try {
    const res = await fetch(
      `${process.env.API_URL}/properties/${id}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`
        }
      }
    );
    return res.json();
  } catch (e) {
    console.log(e);
  }
}

export default async function Home() {
  const property = await fetchProperty(1);

  if (!property) {
    return <span>Nope</span>;
  }

  property.Images;

  return (
    <main className={styles.main}>
      <pre>${JSON.stringify(property, null, 2)}</pre>
    </main>
  );
}
