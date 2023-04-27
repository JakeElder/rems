"use client";

import React from "react";
import css from "./EntryCardGrid.module.css";
import { EntryCard } from "@rems/types";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

type Props = {
  cards: EntryCard[];
};

const Item = ({ card }: { card: EntryCard }) => {
  const { image } = card;

  return (
    <a href={card.url}>
      <div className={css["overlay"]} />
      <div className={css["content"]}>
        <div className={css["title"]}>{card.title}</div>
        <div className={css["caption-and-icon"]}>
          <div className={css["caption"]}>{card.caption}</div>
          <FontAwesomeIcon icon={faArrowRightLong} />
        </div>
      </div>
      <Image
        src={image.src}
        alt={card.title}
        width={image.width}
        height={image.height}
      />
    </a>
  );
};

const EntryCardGrid = ({ cards }: Props) => {
  return (
    <div className={css["root"]}>
      {cards.map((card, idx) => (
        <Item key={idx} card={card} />
      ))}
    </div>
  );
};

export default EntryCardGrid;
