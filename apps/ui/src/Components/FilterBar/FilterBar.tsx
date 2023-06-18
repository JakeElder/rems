import React from "react";
import css from "./FilterBar.module.css";
import Container from "../../Elements/Container/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faChevronDown } from "@fortawesome/free-solid-svg-icons";

type Props = {};

const FilterBar = ({ }: Props) => {
  const toggles = [
    "Sea View",
    "Ocean View",
    "Balcony",
    "Garden",
    "Fitness Center / Gym",
    "Elevator",
    "Terrace",
    "Office",
    "Jaccuzzi",
    "Swimming Pool",
    "Gym",
    "Sauna",
    "New Built",
    "Bar",
    "Panoramic",
    "Scenic View"
  ];

  return (
    <div className={css["root"]}>
      <Container full>
        <div className={css["sections"]}>
          <div className={css["filters"]}>
            <a className={css["control"]}>
              <div className={css["icon"]}>
                <FontAwesomeIcon icon={faSliders} size="sm" />
              </div>
              Filters
            </a>
          </div>
          <div className={css["separator"]} />
          <div className={css["key-filters"]}>
            <a className={css["control"]}>
              Type
              <div className={css["icon"]}>
                <FontAwesomeIcon icon={faChevronDown} size="sm" />
              </div>
            </a>
            <a className={css["control"]}>
              Price
              <div className={css["icon"]}>
                <FontAwesomeIcon icon={faChevronDown} size="sm" />
              </div>
            </a>
            <a className={css["control"]}>
              Beds
              <div className={css["icon"]}>
                <FontAwesomeIcon icon={faChevronDown} size="sm" />
              </div>
            </a>
          </div>
          <div className={css["separator"]} />
          <div className={css["toggles"]}>
            {toggles.map((t) => (
              <a key={t} className={css["control"]}>
                {t}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FilterBar;
