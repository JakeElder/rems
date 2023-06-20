import React from "react";
import css from "./RealEstatePage.module.css";
import { Property } from "@rems/types";
import StandardHeroLayout from "../../Layouts/StandardHeroLayout";
import Footer from "../../Components/Footer";
import Image from "next/image";

type Props = {
  property: Property;
};

const RealEstatePage = ({ property }: Props) => {
  return (
    <StandardHeroLayout
      hero={
        <div className={css["image"]}>
          <div className={css["overlay"]} />
          <Image
            src={property.images[0]}
            alt={property.title}
            width={property.images[0].width}
            height={property.images[0].height}
          />
        </div>
      }
    >
      <pre className={css["pre"]}>{JSON.stringify(property, null, 2)}</pre>
      <Footer />
    </StandardHeroLayout>
  );
};

export default RealEstatePage;
