"use client";

import React, { useEffect, useState } from "react";
import css from "./SimpleImageCarousel.module.css";
import { CarouselImage } from "@rems/types";
import Image from "next/image";
import { animated, useSprings } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import clamp from "lodash.clamp";
import { useElementSize } from "usehooks-ts";
import cn from "classnames";

type Props = {
  images: CarouselImage[];
  fill?: boolean;
};

const Img = animated(Image);

const SimpleImageCarousel = ({ images, fill = false }: Props) => {
  const [index, setIndex] = useState(0);
  const [$root, { width }] = useElementSize();

  const [props, api] = useSprings(
    images.length,
    (i) => ({
      x: i * width,
      scale: 1,
      display: "block"
    }),
    [width]
  );

  useEffect(() => {
    api.start((i) => {
      if (i < index - 1 || i > index + 1) {
        return { display: "none" };
      }
      const x = (i - index) * width + 0;
      return { x, scale: 1, display: "block" };
    });
  }, [index]);

  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], cancel }) => {
      if (active && Math.abs(mx) > width / 2) {
        setIndex((index) =>
          clamp(index + (xDir > 0 ? -1 : 1), 0, images.length - 1)
        );
        cancel();
      }
      api.start((i) => {
        if (i < index - 1 || i > index + 1) {
          return { display: "none" };
        }
        const x = (i - index) * width + (active ? mx : 0);
        const scale = active ? 1 - Math.abs(mx) / width / 2 : 1;
        return { x, scale, display: "block" };
      });
    }
  );

  return (
    <div
      className={cn({
        [css["root"]]: !fill,
        [css["root-fill"]]: fill
      })}
      ref={$root}
    >
      <div className={css["controls"]}>
        <div className={css["container"]}>
          {images.map((i, idx) => (
            <span
              key={i.src}
              onClick={() => setIndex(idx)}
              role="button"
              className={cn({
                [css["control"]]: index !== idx,
                [css["active-control"]]: index === idx
              })}
            />
          ))}
        </div>
      </div>
      <div className={css["images"]}>
        {props.map(({ x, display }, i) => (
          <Img
            key={i}
            draggable={false}
            className={css["image"]}
            alt={images[i].alt}
            src={images[i].src}
            width={images[i].width}
            height={images[i].height}
            {...bind()}
            style={{ x, display, zIndex: images.length - i }}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleImageCarousel;
