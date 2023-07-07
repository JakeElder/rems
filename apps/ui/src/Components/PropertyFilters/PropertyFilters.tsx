import React from "react";
import css from "./PropertyFilters.module.css";
import TypeFilters from "../TypeFilters";
import PriceRange from "../PriceRange";
import BedsFilter from "../BedsFilter";
import BathroomsFilter from "../BathroomsFilter";
import Split from "../../Elements/Split";
import ViewTypeFilters from "../ViewTypeFilters";
import IndoorFeatureFilters from "../IndoorFeatureFilters";
import OutdoorFeatureFilters from "../OutdoorFeatureFilters";
import LotFeatureFilters from "../LotFeatureFilters";
import LivingAreaFilters from "../LivingAreaFilters/LivingAreaFilters";
import NearestMRTStationFilter from "../NearestMRTStationFilter";
import NearestBTSStationFilter from "../NearestBTSStationFilter";

type Props = {};

const PropertyFilters = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["section"]}>
        <div className={css["header"]}>Property Type</div>
        <div className={css["filters"]}>
          <TypeFilters id="dialog" />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Price Range</div>
        <div className={css["filters"]}>
          <PriceRange />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Bedrooms</div>
        <div className={css["filters"]}>
          <BedsFilter />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Bathrooms</div>
        <div className={css["filters"]}>
          <BathroomsFilter />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>View</div>
        <div className={css["filters"]}>
          <ViewTypeFilters />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Indoor Features</div>
        <div className={css["filters"]}>
          <IndoorFeatureFilters />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Outdoor Features</div>
        <div className={css["filters"]}>
          <OutdoorFeatureFilters />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Lot Features</div>
        <div className={css["filters"]}>
          <LotFeatureFilters />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Living Area</div>
        <div className={css["filters"]}>
          <LivingAreaFilters />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Nearest MRT Station</div>
        <div className={css["filters"]}>
          <Split>
            <NearestMRTStationFilter />
          </Split>
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Nearest BTS Station</div>
        <div className={css["filters"]}>
          <Split>
            <NearestBTSStationFilter />
          </Split>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
