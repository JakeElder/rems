"use client";

import React from "react";
import css from "./RealEstateIndexPage.module.css";
import IndexConnector from "../../Components/IndexConnector";

export const Root = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["root"]}>{children}</div>;
};

export const Header = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["header"]}>{children}</div>;
};

export const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["main"]}>
      <IndexConnector>{children}</IndexConnector>
    </div>
  );
};

export const Content = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["content"]}>{children}</div>;
};

export const Breadcrumbs = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["breadcrumbs"]}>{children}</div>;
};

export const Title = ({}: {}) => {
  const title = `Homes for sale in Thailand`;
  return <h1 className={css["title"]}>{title}</h1>;
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
