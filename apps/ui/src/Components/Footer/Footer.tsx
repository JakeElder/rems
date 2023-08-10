"use client";

import React from "react";
import css from "./Footer.module.css";
import Container from "../../Elements/Container";
import Logo from "../../Elements/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLine,
  faInstagramSquare,
  faLinkedin,
  faFacebookSquare
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { ResolvingFilterSet } from "@rems/types";
import { Oval } from "react-loader-spinner";

type Props = {
  full?: boolean;
  popularSearches: React.ReactNode;
  linkedInURL: string;
  lineURL: string;
  instagramURL: string;
  facebookURL: string;
  onContactUsClick: () => void;
};

const UL = ({
  heading,
  links
}: {
  heading: string;
  links: React.ComponentProps<typeof Link>[];
}) => {
  return (
    <div className={css["section"]}>
      <div className={css["heading"]}>{heading}</div>
      <ul className={css["list"]}>
        {links.map((l, idx) => (
          <li key={idx}>
            <Link {...l} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const PopularSearch = ({ set }: { set: ResolvingFilterSet }) => {
  return (
    <li>
      <Link className={css["popular-search"]} href={set.url}>
        {set.set.name}
        <div className={css["count-spinner"]}>
          {set.isLoading ? (
            <div className={css["spinner"]}>
              <Oval height={10} width={10} color="#aaa" secondaryColor="#aaa" />
            </div>
          ) : (
            <div className={css["count"]}>{set.data?.pagination.total}</div>
          )}
        </div>
      </Link>
    </li>
  );
};

export const Root = ({
  full = false,
  popularSearches,
  lineURL,
  facebookURL,
  linkedInURL,
  instagramURL,
  onContactUsClick
}: Props) => {
  return (
    <footer className={css["root"]}>
      <Container full={full}>
        <div className={css["links"]}>
          <UL
            heading="JYOPROPERTY"
            links={[
              { href: "/", children: "Home" },
              { href: "/real-estate", children: "Real Estate" },
              {
                onClick: (e) => {
                  e.preventDefault();
                  onContactUsClick();
                },
                children: "Contact Us",
                href: "#"
              }
            ]}
          />
          <div className={css["section"]}>
            <div className={css["heading"]}>POPULAR SEARCHES</div>
            <ul className={css["list"]}>{popularSearches}</ul>
          </div>
        </div>
        <div className={css["logo-disclaimer-socials"]}>
          <Link href="/" className={css["logo"]}>
            <Logo />
          </Link>
          <div className={css["column-disclaimer"]}>
            Copyright © 2023 Jyo Property Co Ltd
          </div>
          <div className={css["socials"]}>
            <a className={css["linked-in"]} href={lineURL}>
              <FontAwesomeIcon icon={faLine} size="lg" />
            </a>
            <a href={instagramURL}>
              <FontAwesomeIcon icon={faInstagramSquare} size="lg" />
            </a>
            <a href={linkedInURL}>
              <FontAwesomeIcon icon={faLinkedin} size="lg" />
            </a>
            <a href={facebookURL}>
              <FontAwesomeIcon icon={faFacebookSquare} size="lg" />
            </a>
          </div>
        </div>
        <div className={css["full-disclaimer"]}>
          Copyright © 2023 JYO Property Co Ltd
        </div>
      </Container>
    </footer>
  );
};
