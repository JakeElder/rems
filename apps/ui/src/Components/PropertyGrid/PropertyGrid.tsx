"use client";

import React from "react";
import css from "./PropertyGrid.module.css";
import { useRealEstateQuery } from "../RealEstateQueryController";
import PropertyCard from "../PropertyCard";
import { animated, useTransition } from "@react-spring/web";
import { useIndexConnector } from "../IndexConnector";
import { setCookie } from "typescript-cookie";
import { useRouter } from "next/navigation";

type Props = {};

const PropertyGrid = ({}: Props) => {
  const { state } = useRealEstateQuery();
  const properties = state.result?.data || [];
  const { setMouseOver, setMouseOut } = useIndexConnector();
  const { push } = useRouter();

  const transition = useTransition(state.loading, {
    from: { backgroundColor: "rgba(255, 255, 255, 0)" },
    enter: { backgroundColor: "rgba(255, 255, 255, .7)" },
    leave: { backgroundColor: "rgba(255, 255, 255, 0)" }
  });

  var expires = new Date();
  expires.setSeconds(expires.getSeconds() + 60);

  return (
    <div className={css["root"]}>
      <div className={css["properties"]}>
        {properties.map((p) => (
          <div
            key={p.id}
            onMouseOver={() => setMouseOver(p.id)}
            onMouseOut={() => setMouseOut()}
          >
            <PropertyCard
              property={p}
              link={p.url}
              onClick={(e) => {
                e.preventDefault();
                setCookie(
                  "referer",
                  `${window.location.pathname}${window.location.search}`,
                  { expires, path: p.url }
                );
                push(p.url);
              }}
            />
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
