import React, { MutableRefObject, useRef } from "react";
import css from "./FilterBar.module.css";
import Container from "../../Elements/Container/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { useDraggable } from "react-use-draggable-scroll";
import Toggle from "../../Elements/Toggle";
import TypeFilterPopover from "../TypeFilterPopover";
import PriceFilterPopover from "../PriceFilterPopover";
import BedsFilterPopover from "../BedsFilterPopover";

type Props = {};

const FilterBar = ({}: Props) => {
  const toggles = [
    "Sea View",
    "Water View",
    "Pool",
    "Terrace",
    "Garden",
    "Balcony",
    "Mountain View",
    "Air Conditioning",
    "Fitness Center / Gym",
    "Garage",
    "Bar",
    "Modern",
    "Fireplace",
    "Panoramic / Scenic View",
    "Privacy",
    "Elevator",
    "Sauna",
    "Jacuzzi",
    "Gated Community",
    "New Built",
    "Cinema",
    "Investment Property",
    "Open Kitchen",
    "Office",
    "Outdoor Kitchen",
    "Wine Cellar",
    "Game Room",
    "Renovated",
    "Beachfront",
    "Indoor Pool",
    "Coastal",
    "Golf View",
    "Tennis Court",
    "Ocean View",
    "Duplex",
    "Mansion",
    "Steam Room",
    "Waterfront",
    "Seafront",
    "Hilltop",
    "Boat House",
    "Library",
    "City View",
    "Oceanfront",
    "Equestrian",
    "High Altitude",
    "Lake View",
    "Helipad",
    "Private Beach",
    "Vineyard / Winery",
    "River View",
    "Lakefront",
    "Riverfront",
    "Private Airport"
  ];

  const $sections = useRef<HTMLDivElement>(null);
  const { events } = useDraggable(
    $sections as MutableRefObject<HTMLDivElement>
  );

  return (
    <div className={css["root"]} ref={$sections} {...events}>
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
            <TypeFilterPopover />
            <PriceFilterPopover />
            <BedsFilterPopover />
          </div>
          <div className={css["separator"]} />
          <div className={css["toggles"]}>
            {toggles.map((t) => (
              <Toggle key={t}>{t}</Toggle>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FilterBar;
