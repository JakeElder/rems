"use client";

import { PlacesAutocomplete } from "@rems/ui";
import React, { useState } from "react";
import useSWR from "swr";
import useRealEstateQuery from "@/hooks/use-real-estate-query";

type Props = {};

type Place = {
  id: string;
  label: string;
  lng: number;
  lat: number;
};

const fetcher = async (id: string): Promise<Place> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_REMS_API_URL}/places/${id}`
  );
  return res.json();
};

const PlacesAutocompleteViewContainer = ({}: Props) => {
  const { query, onSearchOriginChange } = useRealEstateQuery();
  const [placeId, setPlaceId] = useState(query["search-origin-id"]);

  const { data } = useSWR(
    placeId ? [placeId, "place"] : null,
    ([id]) => fetcher(id),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        onSearchOriginChange(data.id, data.lng, data.lat);
      }
    }
  );

  return (
    <PlacesAutocomplete
      apiKey={process.env.NEXT_PUBLIC_PLACES_API_KEY}
      selectProps={{
        value: data && {
          value: placeId,
          label: data.label
        },
        onChange: (e) => {
          e && setPlaceId(e.value.place_id);
        }
      }}
    />
  );
};

export default PlacesAutocompleteViewContainer;
