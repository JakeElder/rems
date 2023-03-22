import styles from "./page.module.css";
// import Image from "next/image";
// import { FeaturedHero } from "@rems/ui";
import api from "../api";
import { log } from "../utils";

export default async function Home() {
  const { ids } = await api.query.featuredProperties();
  const properties = await api.get.properties(...ids);

  console.log(properties[0].images[0]);
  // log(properties);
  return <pre>{JSON.stringify(properties, null, 2)}</pre>;

  // const images = properties.map((p: any, idx: number) => {
  //   const { url, width, height } = p.attributes.Images.data.attributes;
  //   log(p.attributes.Images.data[0])
  //   const src = `${process.env.ASSET_URL}${url}`;

  //   return (
  //     <Image
  //       key={idx}
  //       src={src}
  //       alt={p.attributes.Title}
  //       width={width}
  //       height={height}
  //     />
  //   );
  // });

  // return <main className={styles.main}>{images}</main>;
}
