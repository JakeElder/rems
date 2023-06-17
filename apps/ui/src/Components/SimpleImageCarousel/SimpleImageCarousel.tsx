import React, { useState } from "react";
import css from "./SimpleImageCarousel.module.css";
import { CarouselImage } from "@rems/types";
import { default as Img } from "next/image";
import cm from "classnames";
import { animated, useSpring } from "@react-spring/web";

type Props = {
  images: CarouselImage[];
};

const SimpleImageCarousel = ({ images }: Props) => {
  const [slide, setSlide] = useState(0);
  const { left } = useSpring({ left: `${slide * -100}%` });

  return (
    <div className={css["root"]}>
      <div className={css["controls"]}>
        <div className={css["container"]}>
          {images.map((i, idx) => (
            <span
              key={i.src}
              onClick={() => setSlide(idx)}
              role="button"
              className={cm({
                [css["control"]]: slide !== idx,
                [css["active-control"]]: slide === idx
              })}
            />
          ))}
        </div>
      </div>
      <animated.div className={css["images"]} style={{ left }}>
        {images.map((i, idx) => (
          <Img
            key={idx}
            className={css["image"]}
            alt={i.alt}
            src={i.src}
            width={i.width}
            height={i.height}
          />
        ))}
      </animated.div>
    </div>
  );
};

export default SimpleImageCarousel;
