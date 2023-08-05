'use client';

import React from "react";
import css from "./EntryCardGrid.module.css";
import { EntryCard } from "@rems/types";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { Oval } from "react-loader-spinner";

type Props = {
  children: React.ReactNode;
};

export const Item = ({ card }: { card: EntryCard }) => {
  const { image } = card;

  return (
    <a className={css["item"]} href={card.url}>
      <div className={css["img"]}>
        <Image
          src={image.url}
          alt={card.title}
          width={image.width}
          height={image.height}
        />
      </div>
      <div className={css["overlay"]} />
      <div className={css["content"]}>
        <div className={css["title"]}>{card.title}</div>
        <div className={css["caption-and-icon"]}>
          <div className={css["caption"]}>
            {card.loading ? (
              <Oval height={13} width={13} color="#aaa" secondaryColor="#aaa" />
            ) : (
              card.caption
            )}
          </div>
          <div className={css["icon"]}>
            <FontAwesomeIcon icon={faArrowRightLong} />
          </div>
        </div>
      </div>
    </a>
  );
};

export const Root = ({ children }: Props) => {
  return <div className={css["root"]}>{children}</div>;
};
