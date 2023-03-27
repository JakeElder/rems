"use client";

import React, { useState } from "react";
import Header from "../Header";
import { useTransition, animated } from "@react-spring/web";
import css from "./FeaturedHero.module.css";
import JourneyBar from "../JourneyBar";
import { Property } from "@rems/types";
import Image from "next/image";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

function mod(n, m) {
  return ((n % m) + m) % m;
}

type Props = {
  properties: Property[];
  theme: "dark" | "light";
  duration?: number;
};

const FeaturedHero = ({ properties, theme, duration = 5000 }: Props) => {
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
      <div className={css["header-and-content"]}>
        <div className={css["header"]}>
          <Header theme={theme} />
        </div>
        <div className={css["content"]}>
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
                    <animated.span style={style} className={css["description"]}>
                      {properties[i].title}
                      <span className={css["separator"]}>&bull;</span>
                      {properties[i].formattedPurchasePrice}
                    </animated.span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedHero;
