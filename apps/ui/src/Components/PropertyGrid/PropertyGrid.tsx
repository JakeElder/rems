"use client";

import React from "react";
import css from "./PropertyGrid.module.css";
import { useRealEstateQuery } from "../RealEstateQueryController";
import PropertyCard from "../PropertyCard";
import slugify from "slugify";
import { animated, useTransition } from "@react-spring/web";

type Props = {};

const PropertyGrid = ({}: Props) => {
  const { loading, result } = useRealEstateQuery();
  const properties = result?.data || [];

  const transition = useTransition(loading, {
    from: { backgroundColor: "rgba(255, 255, 255, 0)" },
    enter: { backgroundColor: "rgba(255, 255, 255, .7)" },
    leave: { backgroundColor: "rgba(255, 255, 255, 0)" }
  });

  return (
    <div className={css["root"]}>
      <div className={css["properties"]}>
        {properties.map((p) => (
          <PropertyCard
            key={p.id}
            property={p}
            link={`/real-estate/${slugify(p.title)}-${p.id}`}
          />
        ))}
      </div>
      {transition(
        (styles, show) =>
          show && <animated.div className={css["loading"]} style={styles} />
      )}
    </div>
  );
};

export default PropertyGrid;
