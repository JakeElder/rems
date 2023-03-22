'use client';

import React, { useState } from "react";
import Header from "../Header";
import { useTransition, animated } from "@react-spring/web";
import css from "./FeaturedHero.module.css";
import { StaticImageData } from "next/image";
import JourneyBar from "../JourneyBar";

type Props = {
  images: StaticImageData[];
  theme: 'dark' | 'light';
  duration?: number;
};

const FeaturedHero = ({ images, theme, duration = 3000 }: Props) => {
  const [step, set] = useState(0);

  const transitions = useTransition(step, {
    key: step,
    initial: null,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 600 }
  });

  return (
    <div className={css["root"]}>
      {transitions((style, i) => (
        <animated.img
          className={css["img"]}
          style={style}
          src={images[i].src}
        />
      ))}
      <div className={css["overlay"]} />
      <div className={css["header-and-content"]}>
        <div className={css["header"]}>
          <Header theme={theme} />
        </div>
        <div className={css["content"]}>
          <h1 className={css["h1"]}>
            Bangkok's #1 Luxury Real Estate Marketplace
          </h1>
          <div className={css["journey-bar"]}>
            <JourneyBar
              steps={images.length}
              step={step}
              duration={duration}
              onStepComplete={() => {
                set((step) => (step + 1) % images.length);
              }}
            />
          </div>
          <div className={css["description"]}>
            House In Nassau, New Providence, The Bahamas • $5,395,000
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedHero;
