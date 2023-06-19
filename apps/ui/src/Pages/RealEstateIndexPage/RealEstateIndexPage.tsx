"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Property } from "@rems/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Header from "../../Components/Header";
import FilterBar from "../../Components/FilterBar";
import css from "./RealEstateIndexPage.module.css";
import Container from "../../Elements/Container";
import PropertyCard from "../../Components/PropertyCard";
import Footer from "../../Components/Footer";
import MonogramHR from "../../Components/MonogramHR";

type Props = {
  properties: Property[];
};

const RealEstateIndexPage = ({ properties }: Props) => {
  const [selection, setSelection] = useState("Popular");
  return (
    <div>
      <div className={css["header"]}>
        <Header full mode="standard" />
      </div>
      <div className={css["filter-bar"]}>
        <FilterBar />
      </div>
      <Container full>
        <div className={css["breadcrumbs"]}>
          <Link href="/">Home</Link>
          <div className={css["separator"]}>/</div>
          <span className={css["location"]}>Real Estate</span>
        </div>
        <h1 className={css["title"]}>Homes for sale in Thailand</h1>
        <div className={css["count-and-sort"]}>
          <div className={css["count"]}>{properties.length} listings</div>
          <div className={css["sort"]}>
            <select
              className={css["select"]}
              onChange={(e) => setSelection(e.currentTarget.value)}
            >
              <option>Popular</option>
              <option>Lowest Price First</option>
              <option>Highest Price First</option>
              <option>Largest Area First</option>
              <option>Smallest Area First</option>
            </select>
            <div className={css["active"]}>
              <span className={css["label"]}>Sort:</span>
              <span className={css["selection"]}>{selection}</span>
              <span className={css["icon"]}>
                <FontAwesomeIcon icon={faChevronDown} size="sm" />
              </span>
            </div>
          </div>
        </div>
        <div className={css["properties"]}>
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
        <div className={css["hr"]}>
          <MonogramHR />
        </div>
      </Container>
      <div className={css["footer"]}>
        <Footer />
      </div>
    </div>
  );
};

export default RealEstateIndexPage;
