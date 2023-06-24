import React, { ComponentProps } from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import css from "./Slider.module.css";

type Props = ComponentProps<typeof RadixSlider.Root>;

const Slider = (props: Props) => {
  return (
    <RadixSlider.Root
      {...props}
      className={css["root"]}
      minStepsBetweenThumbs={1}
    >
      <RadixSlider.Track className={css["track"]}>
        <RadixSlider.Range className={css["range"]} />
      </RadixSlider.Track>
      <RadixSlider.Thumb className={css["thumb"]} />
      <RadixSlider.Thumb className={css["thumb"]} />
    </RadixSlider.Root>
  );
};

export default Slider;
