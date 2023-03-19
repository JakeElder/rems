import styles from "./page.module.css";

async function fetchProperties() {
  console.log(process.env.API_URL);
  try {
    const res = await fetch(`${process.env.API_URL}/properties`, {
      headers: { Authorization: `Bearer ${process.env.API_TOKEN}` }
    });
    return res.json();
  } catch (e) {
    console.error(e);
  }
}

export default async function Home() {
  const properties = await fetchProperties();

  return (
    <main className={styles.main}>
      <pre>${JSON.stringify(properties, null, 2)}</pre>
    </main>
  );
}
