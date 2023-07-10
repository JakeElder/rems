import React from "react";
import css from "./RealEstatePage.module.css";
import { Property } from "@rems/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import * as Layout from "../../Layouts/StandardHeroLayout";
import FooterView from "../../Components/Footer";
import Container from "../../Elements/Container";
import MonogramHR from "../../Components/MonogramHR";
import Truncate from "../../Components/Truncate";
import AreaMap from "../../Components/AreaMap";

export const Root = ({ children }: { children: React.ReactNode }) => {
  return <Layout.Root>{children}</Layout.Root>;
};

export const Header = ({ children }: { children: React.ReactNode }) => {
  return <Layout.Header>{children}</Layout.Header>;
};

export const Carousel = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout.Hero>
      <div className={css["image"]}>
        {children}
        <div className={css["overlay"]} />
      </div>
    </Layout.Hero>
  );
};

export const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout.Content>
      <Container>
        <div className={css["content"]}>{children}</div>
      </Container>
    </Layout.Content>
  );
};

export const Main = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["main"]}>{children}</div>;
};

export const Breadcrumbs = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["breadcrumbs"]}>{children}</div>;
};

export const TitleAndDescription = ({ property }: { property: Property }) => {
  const listed = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(property.createdAt));

  return (
    <>
      <h1 className={css["title"]}>{property.title}</h1>
      <div className={css["price"]}>{property.formattedPurchasePrice}</div>
      <div className={css["beds-baths-area"]}>
        <span className={css["beds"]}>{property.bedrooms} beds</span>
        <span className={css["separator"]}>&bull;</span>
        <span className={css["baths"]}>{property.bathrooms} baths</span>
        <span className={css["separator"]}>&bull;</span>
        <span className={css["area"]}>{property.livingArea}m&#178;</span>
      </div>
      <div className={css["description"]}>
        <Truncate copy={property.description} />
      </div>
      <div className={css["listed"]}>Listed {listed}</div>
      <div className={css["score"]} />
    </>
  );
};

export const Features = ({ property }: { property: Property }) => {
  const features = [
    ...property.indoorFeatures,
    ...property.lotFeatures,
    ...property.outdoorFeatures,
    ...property.viewTypes
  ];

  return (
    <>
      <h2 className={css["heading"]}>Features</h2>
      <ul className={css["features"]}>
        {features.map((f) => (
          <li key={f.slug} className={css["feature"]}>
            <span className={css["icon"]}>
              <FontAwesomeIcon icon={faCircleNotch} size="xs" />
            </span>
            {f.name}
          </li>
        ))}
      </ul>
      <div className={css["score"]} />
    </>
  );
};

export const ContactAgent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["contact-agent"]}>
      <h2 className={css["heading"]}>Contact Agent</h2>
      {children}
    </div>
  );
};

export const AskAQuestion = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className={css["ask-a-question"]}>
        <h2 className={css["heading"]}>Ask a Question</h2>
        {children}
      </div>
      <div className={css["score"]} />
    </>
  );
};

export const TheArea = ({ property }: { property: Property }) => {
  return (
    <>
      <div className={css["the-area"]}>
        <h2 className={css["heading"]}>The Area</h2>
        <div className={css["address"]}>{property.address}</div>
        <div className={css["map"]}>
          <AreaMap property={property} />
        </div>
      </div>
      <div className={css["hr"]}>
        <MonogramHR />
      </div>
    </>
  );
};

export const Contact = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["contact"]}>
      <div className={css["contact-module"]}>{children}</div>
    </div>
  );
};

export const Footer = () => {
  return <FooterView />;
};
