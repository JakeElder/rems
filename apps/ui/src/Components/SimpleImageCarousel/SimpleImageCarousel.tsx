"use client";

import React, { useEffect, useState } from "react";
import css from "./SimpleImageCarousel.module.css";
import { CarouselImage } from "@rems/types";
import Image from "next/image";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import clamp from "lodash.clamp";
import { useElementSize } from "usehooks-ts";
import cn from "classnames";
import Link from "next/link";

type Props = {
  children?: React.ReactNode;
  images: CarouselImage[];
  fill?: boolean;
  link?: string;
  index?: number;
  onIndexChange?: (index: number) => void;
};

const Img = animated(Image);

const SimpleImageCarousel = ({ index, onIndexChange, ...props }: Props) => {
  if (typeof index !== "undefined" && onIndexChange) {
    return (
      <ControlledImageCarousel
        {...props}
        index={index}
        onIndexChange={onIndexChange}
      />
    );
  }

  return <UncontrolledImageCarousel {...props} />;
};

type UncontrolledProps = {
  images: CarouselImage[];
  children?: React.ReactNode;
  fill?: boolean;
  link?: string;
};

const UncontrolledImageCarousel = (props: UncontrolledProps) => {
  const [index, setIndex] = useState(0);
  return (
    <ControlledImageCarousel
      {...props}
      index={index}
      onIndexChange={setIndex}
    />
  );
};

type ControlledProps = {
  children?: React.ReactNode;
  images: CarouselImage[];
  fill?: boolean;
  index: number;
  onIndexChange: (index: number) => void;
  link?: string;
};

const ControlledImageCarousel = ({
  onIndexChange,
  fill,
  images,
  children,
  index,
  link
}: ControlledProps) => {
  const [$root, { width }] = useElementSize();

  const [props, api] = useSpring(
    {
      to: { x: 0 },
      immediate: true
    },
    [width]
  );

  useEffect(() => {
    api.start((i) => {
      const x = (i - index) * width;
      return { x };
    });
  }, [index]);

  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], cancel, event }) => {
      event.preventDefault();
      if (active && Math.abs(mx) > width / 4) {
        onIndexChange(clamp(index + (xDir > 0 ? -1 : 1), 0, images.length - 1));
        cancel();
      }

      api.start((i) => {
        const x = (i - index) * width + (active ? mx : 0);
        return { x };
      });
    },
    {
      axis: "x",
      preventDefault: true,
      filterTaps: true
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
              onClick={(e) => {
                e.preventDefault();
                onIndexChange(idx);
              }}
              role="button"
              className={cn({
                [css["control"]]: index !== idx,
                [css["active-control"]]: index === idx
              })}
            />
          ))}
        </div>
      </div>
      <Images className={css["images"]} {...bind()} link={link} style={props}>
        {images.map((i) => (
          <Img
            priority
            key={i.id}
            draggable={false}
            className={css["image"]}
            alt={i.alt}
            src={i.src}
            width={i.width}
            height={i.height}
          />
        ))}
      </Images>
      {children}
    </div>
  );
};

const Images = ({
  link,
  style,
  ...props
}: ReturnType<typeof useDrag> & {
  link: Props["link"];
}) => {
  return (
    <animated.div className={css["images"]} style={style}>
      {link ? <Link href={link} {...props} /> : <div {...props} />}
    </animated.div>
  );
};

export default SimpleImageCarousel;
