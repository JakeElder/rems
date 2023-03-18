import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Image
        className={styles.logo}
        src="/logo.svg"
        alt="JYO Property Logo"
        width={158}
        height={108}
        priority
      />
    </main>
  );
}
