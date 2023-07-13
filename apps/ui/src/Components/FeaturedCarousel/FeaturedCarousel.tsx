"use client";

import React, { useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import css from "./FeaturedCarousel.module.css";
import JourneyBar from "../JourneyBar";
import { Property } from "@rems/types";
import Image from "next/image";
import Container from "../../Elements/Container/Container";
import Link from "next/link";
import { useDrag } from "@use-gesture/react";

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

type Props = {
  properties: Property[];
  duration?: number;
};

const FeaturedCarousel = ({ properties, duration = 5000 }: Props) => {
  const [step, set] = useState(0);

  const bind = useDrag(({ swipe: [swipeX] }) => {
    if (swipeX === 1) {
      set((step) => mod(step + 1, properties.length));
    }

    if (swipeX === -1) {
      set((step) => mod(step - 1, properties.length));
    }
  });

  const transitions = useTransition(step, {
    key: step,
    initial: null,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 600 }
  });

  return (
    <div className={css["root"]} {...bind()}>
      {transitions((style, i) => {
        const img = properties[i].images[0];
        return (
          <animated.div className={css["image"]} style={style}>
            <Image
              alt={properties[i].title}
              src={img.src}
              width={img.width}
              height={img.height}
            />
          </animated.div>
        );
      })}
      <div className={css["overlay"]} />
      <div className={css["content"]}>
        <Container>
          <div className={css["intro-and-journey-description"]}>
            <div className={css["intro"]}>
              <h1 className={css["h1"]}>
                Bangkoks #1 Luxury Real Estate Marketplace
              </h1>
              <p className={css["strapline"]}></p>
            </div>
            <div className={css["journey-and-description"]}>
              <div className={css["journey-bar"]}>
                <JourneyBar
                  steps={properties.length}
                  step={step}
                  duration={duration}
                  onStepComplete={() => {
                    set((step) => mod(step + 1, properties.length));
                  }}
                  onNextRequest={() => {
                    set((step) => mod(step + 1, properties.length));
                  }}
                  onPrevRequest={() => {
                    set((step) => mod(step - 1, properties.length));
                  }}
                />
              </div>
              <div className={css["description-container"]}>
                {transitions((style, i) => {
                  return (
                    <Link href={properties[i].url}>
                      <animated.span
                        style={style}
                        className={css["description"]}
                      >
                        {properties[i].title}
                        <span className={css["separator"]}>&bull;</span>
                        {properties[i].formattedPurchasePrice}
                      </animated.span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
