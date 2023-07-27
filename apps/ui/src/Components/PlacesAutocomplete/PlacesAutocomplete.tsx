"use client";

import React from "react";
import css from "./PlacesAutocomplete.module.css";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

type Props = React.ComponentProps<typeof GooglePlacesAutocomplete>;

const PlacesAutocomplete = ({ selectProps, ...props }: Props) => {
  return (
    <div className={css["root"]}>
      <GooglePlacesAutocomplete
        {...props}
        selectProps={{
          ...selectProps,
          classNames: {
            control: () => css["select"],
            dropdownIndicator: () => css["indicator"],
            valueContainer: () => css["value"]
          },
          theme: (theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary: "black",
              neutral20: "#e0e0e0"
            }
          })
        }}
      />
    </div>
  );
};

export default PlacesAutocomplete;
