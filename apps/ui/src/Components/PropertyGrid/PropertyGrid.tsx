"use client";

import React from "react";
import css from "./PropertyGrid.module.css";
import { useRealEstateQuery } from "../RealEstateQueryController";
import PropertyCard from "../PropertyCard";
import { animated, useTransition } from "@react-spring/web";
import { useIndexConnector } from "../IndexConnector";

type Props = {};

const PropertyGrid = ({}: Props) => {
  const { loading, result } = useRealEstateQuery();
  const properties = result?.data || [];
  const { setMouseOver, setMouseOut } = useIndexConnector();

  const transition = useTransition(loading, {
    from: { backgroundColor: "rgba(255, 255, 255, 0)" },
    enter: { backgroundColor: "rgba(255, 255, 255, .7)" },
    leave: { backgroundColor: "rgba(255, 255, 255, 0)" }
  });

  return (
    <div className={css["root"]}>
      <div className={css["properties"]}>
        {properties.map((p) => (
          <div
            onMouseOver={() => setMouseOver(p.id)}
            onMouseOut={() => setMouseOut()}
          >
            <PropertyCard key={p.id} property={p} link={p.url} />
          </div>
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
