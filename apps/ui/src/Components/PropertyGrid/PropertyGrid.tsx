"use client";

import React from "react";
import css from "./PropertyGrid.module.css";
import { useRealEstateQuery } from "../RealEstateQueryController";
import PropertyCard from "../PropertyCard";
import { animated, useTransition } from "@react-spring/web";
import { useIndexConnector } from "../IndexConnector";

type Props = {};

const PropertyGrid = ({}: Props) => {
  const { state } = useRealEstateQuery();
  const properties = state.result?.data || [];
  const { setMouseOver, setMouseOut } = useIndexConnector();

  const transition = useTransition(state.loading, {
    from: { backgroundColor: "rgba(255, 255, 255, 0)" },
    enter: { backgroundColor: "rgba(255, 255, 255, .7)" },
    leave: { backgroundColor: "rgba(255, 255, 255, 0)" }
  });

  return (
    <div className={css["root"]}>
      <div className={css["properties"]}>
        {properties.map((p) => (
          <div
            key={p.id}
            onMouseOver={() => setMouseOver(p.id)}
            onMouseOut={() => setMouseOut()}
          >
            <PropertyCard property={p} link={p.url} />
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
