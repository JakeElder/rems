"use client";

import React from "react";
import css from "./RealEstateIndexPage.module.css";
import IndexConnector from "../../Components/IndexConnector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-regular-svg-icons";
import * as CB from "@radix-ui/react-checkbox";
import { animated, useSpring } from "@react-spring/web";

export const Root = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["root"]}>{children}</div>;
};

export const Header = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => {
  return (
    <div className={css["header"]} ref={ref}>
      {children}
    </div>
  );
});

export const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["main"]}>
      <IndexConnector>{children}</IndexConnector>
    </div>
  );
};

export const Content = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => {
  return (
    <div className={css["content"]} ref={ref}>
      {children}
    </div>
  );
});

export const Breadcrumbs = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["breadcrumbs"]}>{children}</div>;
};

export const LocationSource = ({
  location,
  type,
  geospatialOperator
}: {
  type: string;
  geospatialOperator: string;
  location: string;
}) => {
  return (
    <div className={css["location-source"]}>
      Homes for {type} {geospatialOperator}{" "}
      <span className={css["location"]}>{location}</span>
    </div>
  );
};

type OnShowDistanceChange = React.ComponentProps<
  typeof CB.Root
>["onCheckedChange"];

const DistanceToggle = ({
  show,
  on,
  onShowDistanceChange
}: {
  show: boolean;
  on: boolean;
  onShowDistanceChange: OnShowDistanceChange;
}) => {
  const style = useSpring({
    x: show ? 10 : 0,
    opacity: show ? 1 : 0
  });

  return (
    <animated.div className={css["distance-toggle"]} style={style}>
      <label className={css["label"]} htmlFor="distance-toggle">
        <CB.Root
          className={css["checkbox"]}
          id="distance-toggle"
          checked={on}
          onCheckedChange={onShowDistanceChange}
        >
          <CB.Indicator className={css["indicator"]}>
            <svg width={6.664} height={6.202} className={css["tick"]}>
              <path
                fill="none"
                fillRule="evenodd"
                stroke="#8C2EBB"
                strokeLinecap="square"
                d="m.707 4.026 1.45 1.43L5.962.703"
              />
            </svg>
          </CB.Indicator>
        </CB.Root>
        show distance
      </label>
    </animated.div>
  );
};

export const LocationResolution = ({
  resolution,
  distanceAvailable,
  showDistance,
  onShowDistanceChange
}: {
  resolution?: string;
  distanceAvailable: boolean;
  showDistance: boolean;
  onShowDistanceChange: OnShowDistanceChange;
}) => {
  return (
    <div className={css["resolution"]}>
      <span className={css["pill"]}>
        <FontAwesomeIcon className={css["icon"]} icon={faMap} size="xs" />
        {resolution}
      </span>
      <DistanceToggle
        show={distanceAvailable}
        on={showDistance}
        onShowDistanceChange={onShowDistanceChange}
      />
    </div>
  );
};

export const Title = ({ children }: { children: React.ReactNode }) => {
  return <h1 className={css["title"]}>{children}</h1>;
};

export const CountAndSort = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["count-and-sort"]}>{children}</div>;
};

export const Properties = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["properties"]}>{children}</div>;
};

export const Pagination = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["pagination"]}>{children}</div>;
};

export const Map = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["map"]}>
      <div className={css["map-inner"]}>{children}</div>
    </div>
  );
};

export const Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["footer"]}>{children}</div>;
};
