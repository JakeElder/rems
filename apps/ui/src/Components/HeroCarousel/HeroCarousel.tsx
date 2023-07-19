"use client";

import React, { useState } from "react";
import css from "./HeroCarousel.module.css";
import SimpleImageCarousel from "../SimpleImageCarousel";
import ArrowNav from "../ArrowNav";
import Container from "../../Elements/Container";

type Props = {
  images: React.ComponentProps<typeof SimpleImageCarousel>["images"];
};

const HeroCarousel = ({ images }: Props) => {
  const [image, setImage] = useState(0);

  return (
    <div className={css["root"]}>
      <SimpleImageCarousel
        images={images}
        fill
        index={image}
        onIndexChange={setImage}
      />
      <div className={css["arrow-nav"]}>
        <Container style={{ position: "relative", height: "100%" }}>
          <div style={{ position: "relative", height: "100%" }}>
            <ArrowNav
              size="xl"
              show={true}
              hasNext={image !== images.length - 1}
              hasPrev={image !== 0}
              onNext={() => setImage(image + 1)}
              onPrev={() => setImage(image - 1)}
            />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default HeroCarousel;
