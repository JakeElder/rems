import React from "react";
import css from "./HoldingPage.module.css";
import img from "../../assets/coming-soon.webp";
import Image from "next/image";

type Props = {};

const HoldingPage = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <Image src={img} width={img.width} height={img.height} alt="" />
    </div>
  );
};

export default HoldingPage;
