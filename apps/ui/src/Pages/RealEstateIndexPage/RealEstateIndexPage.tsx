"use client";

import React from "react";
import css from "./RealEstateIndexPage.module.css";
import IndexConnector from "../../Components/IndexConnector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-regular-svg-icons";

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

export const Title = ({
  location,
  type,
  geospatialOperator,
  resolution
}: {
  type: string;
  geospatialOperator: string;
  location: string;
  resolution?: string;
}) => {
  return (
    <h1 className={css["title"]}>
      <div className={css["title-main"]}>
        Homes for {type} {geospatialOperator}{" "}
        <span className={css["location"]}>{location}</span>
      </div>
      {resolution && (
        <div className={css["resolution"]}>
          <span>
            <FontAwesomeIcon className={css["icon"]} icon={faMap} size="xs" />
            {resolution}
          </span>
        </div>
      )}
    </h1>
  );
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
