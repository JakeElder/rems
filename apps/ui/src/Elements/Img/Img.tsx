import React from "react";
import css from "./Img.module.css";
import NextImage from "next/image";
import { CldImage } from "next-cloudinary";
import { Image } from "@rems/types";

type Props = Image & React.ImgHTMLAttributes<HTMLImageElement>;

const Img = ({ type, props, src, alt, placeholder, ...rest }: Props) => {
  if (type === "cloudinary") {
    return (
      <CldImage
        {...rest}
        src={props.id}
        alt={alt!}
        width={props.width}
        height={props.height}
        sizes="100vw"
      />
    );
  }

  if (type === "local") {
    return (
      <NextImage
        {...rest}
        alt={alt!}
        src={props.url}
        width={props.width}
        height={props.height}
      />
    );
  }

  return null;
};

export default Img;
