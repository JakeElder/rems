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

type Props = {
  full?: boolean;
  popularSearches: React.ComponentProps<typeof Link>[];
  linkedInURL: string;
  lineURL: string;
  instagramURL: string;
  facebookURL: string;
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

const Footer = ({
  full = false,
  popularSearches,
  lineURL,
  facebookURL,
  linkedInURL,
  instagramURL
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
              { href: "#", children: "Contact Us" }
            ]}
          />
          <UL heading="POPULAR SEARCHES" links={popularSearches} />
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

export default Footer;
