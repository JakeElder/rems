'use client';

import React from "react";
import { Property } from "@rems/types";
import Header from "../../Components/Header/Header";
import FilterBar from "../../Components/FilterBar/FilterBar";

type Props = {
  properties: Property[];
};

const RealEstateIndexPage = ({}: Props) => {
  return (
    <div>
      <Header full mode="standard" />
      <FilterBar />
    </div>
  );
};

export default RealEstateIndexPage;
