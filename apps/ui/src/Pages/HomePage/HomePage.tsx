import React from "react";
import * as Layout from "../../Layouts/StandardHeroLayout";
import Container from "../../Elements/Container/Container";
import css from "./HomePage.module.css";
import MonogramHR from "../../Components/MonogramHR";

export const Root = ({ children }: { children: React.ReactNode }) => {
  return <Layout.Root>{children}</Layout.Root>;
};

export const Header = ({ children }: { children: React.ReactNode }) => {
  return <Layout.Header>{children}</Layout.Header>;
};

export const Hero = ({ children }: { children: React.ReactNode }) => {
  return <Layout.Hero>{children}</Layout.Hero>;
};

export const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout.Content>
      <Container>
        <div className={css["content"]}>{children}</div>
        <div className={css["hr"]}>
          <MonogramHR />
        </div>
      </Container>
    </Layout.Content>
  );
};

export const PopularSearches = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={css["popular-searches"]}>
      <h2 className={css["heading"]}>Popular Searches</h2>
      {children}
    </div>
  );
};

export const EmailCollector = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["email-collector"]}>{children}</div>;
};

export const LatestProperties = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={css["latest-properties"]}>
      <h2 className={css["heading"]}>Latest Properties</h2>
      {children}
    </div>
  );
};

export const Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["footer"]}>{children}</div>;
};
