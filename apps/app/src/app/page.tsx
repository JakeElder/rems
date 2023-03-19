import styles from "./page.module.css";

export const revalidate = 10;

async function fetchProperties() {
  const res = await fetch(`${process.env.API_URL}/properties`, {
    headers: { Authorization: `Bearer ${process.env.API_TOKEN}` }
  });
  const json = res.json();
  console.log(json);
  return json;
}

export default async function Home() {
  const properties = await fetchProperties();

  return (
    <main className={styles.main}>
      <pre>${JSON.stringify(properties, null, 2)}</pre>
    </main>
  );
}
