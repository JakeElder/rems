import React from "react";
import css from "./RealEstatePage.module.css";
import { Property } from "@rems/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import StandardHeroLayout from "../../Layouts/StandardHeroLayout";
import Footer from "../../Components/Footer";
import SimpleImageCarousel from "../../Components/SimpleImageCarousel";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Container from "../../Elements/Container";
import MonogramHR from "../../Components/MonogramHR";
import Truncate from "../../Components/Truncate";
import AskAQuestionForm from "../../Components/AskAQuestionForm";
import AreaMap from "../../Components/AreaMap";
import ContactAgentModule from "../../Components/ContactAgentModule";
import ContactAgentForm from "../../Components/ContactAgentForm/ContactAgentForm";

type Props = {
  property: Property;
};

const RealEstatePage = ({ property }: Props) => {
  const images = property.images.map((i) => ({
    ...i,
    alt: property.title
  }));

  const listed = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(property.createdAt));

  const features = [
    ...property.indoorFeatures,
    ...property.lotFeatures,
    ...property.outdoorFeatures,
    ...property.viewTypes
  ];

  return (
    <StandardHeroLayout
      hero={
        <div className={css["image"]}>
          <SimpleImageCarousel fill images={images} />
          <div className={css["overlay"]} />
        </div>
      }
    >
      <Container>
        <div className={css["content"]}>
          <div className={css["main"]}>
            <div className={css["breadcrumbs"]}>
              <Breadcrumbs />
            </div>
            <h1 className={css["title"]}>{property.title}</h1>
            <div className={css["price"]}>
              {property.formattedPurchasePrice}
            </div>
            <div className={css["beds-baths-area"]}>
              <span className={css["beds"]}>{property.bedrooms} beds</span>
              <span className={css["separator"]}>&bull;</span>
              <span className={css["baths"]}>{property.bathrooms} baths</span>
              <span className={css["separator"]}>&bull;</span>
              <span className={css["area"]}>{property.area}m&#178;</span>
            </div>
            <div className={css["description"]}>
              <Truncate copy={property.description} />
            </div>
            <div className={css["listed"]}>Listed {listed}</div>
            <div className={css["score"]} />
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
            <div className={css["contact-agent"]}>
              <h2 className={css["heading"]}>Contact Agent</h2>
              <ContactAgentForm />
            </div>
            <div className={css["ask-a-question"]}>
              <h2 className={css["heading"]}>Ask a Question</h2>
              <AskAQuestionForm />
            </div>
            <div className={css["score"]} />
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
          </div>
          <div className={css["contact"]}>
            <div className={css["contact-module"]}>
              <ContactAgentModule />
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </StandardHeroLayout>
  );
};

export default RealEstatePage;
