import React from "react";
import css from "./PropertyFilters.module.css";
import Split from "../../Elements/Split";

export const Root = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["root"]}>{children}</div>;
};

export const PropertyType = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Property Type</div>
      <div className={css["filters"]}>{children}</div>
    </div>
  );
};

export const Location = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Location</div>
      <div className={css["filters"]}>{children}</div>
    </div>
  );
};

export const SearchRadius = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Search Radius</div>
      <div className={css["filters"]}>{children}</div>
    </div>
  );
};

export const Availability = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Availability</div>
      <div className={css["filters"]}>{children}</div>
    </div>
  );
};

export const PriceRange = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Price Range</div>
      <div className={css["filters"]}>{children}</div>
    </div>
  );
};

export const Bedrooms = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Bedrooms</div>
      <div className={css["filters"]}>{children}</div>
    </div>
  );
};

export const Bathrooms = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Bathrooms</div>
      <div className={css["filters"]}>{children}</div>
    </div>
  );
};

export const View = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>View</div>
      <div className={css["filters"]}>{children}</div>
    </div>
  );
};

export const IndoorFeatures = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Indoor Features</div>
      <div className={css["filters"]}>{children}</div>
    </div>
  );
};

export const OutdoorFeatures = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Outdoor Features</div>
      <div className={css["filters"]}>{children}</div>
    </div>
  );
};

export const LotFeatures = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Lot Features</div>
      <div className={css["filters"]}>{children}</div>
    </div>
  );
};

export const LivingArea = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Living Area</div>
      <div className={css["filters"]}>{children}</div>
    </div>
  );
};

export const LotSize = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Lot Size</div>
      <div className={css["filters"]}>{children}</div>
    </div>
  );
};

export const NearestMRTStation = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Nearest MRT Station</div>
      <div className={css["filters"]}>
        <Split>{children}</Split>
      </div>
    </div>
  );
};

export const NearestBTSStation = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={css["section"]}>
      <div className={css["header"]}>Nearest BTS Station</div>
      <div className={css["filters"]}>
        <Split>{children}</Split>
      </div>
    </div>
  );
};
