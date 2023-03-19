import styles from "./page.module.css";
import api from "../api";

export default async function Home() {
  const properties = await api.get.properties();

  return (
    <main className={styles.main}>
      <pre>${JSON.stringify(properties, null, 2)}</pre>
    </main>
  );
}
