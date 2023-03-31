import React from "react";
import { Property } from "@rems/types";
import ListingMap from "../../Components/ListingMap/ListingMap";
import StandardHeroLayout from "../../Layouts/StandardHeroLayout/StandardHeroLayout";

type Props = {
  properties: Property[];
};

const RealEstateIndexPage = ({ properties }: Props) => {
  return (
    <StandardHeroLayout hero={<ListingMap properties={properties} />}>
      {null}
    </StandardHeroLayout>
  );
};

export default RealEstateIndexPage;
