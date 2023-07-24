"use client";

import React from "react";
import css from "./MailingListModule.module.css";
import Button from "../../Elements/Button";

type Props = {
  isSubmitting: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

const MailingListModule = ({ isSubmitting, onSubmit }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["content"]}>
        <h2 className={css["heading"]}>Join Our Mailing List</h2>
        <p className={css["lede"]}>
          We work with property developers and individuals to bring you the{" "}
          <em>best real estate</em> in <em>Thailand</em>. Sign up to our
          mailling list to be amongst the first notified when we update our
          listings.
        </p>
        <form className={css["form"]} onSubmit={onSubmit}>
          <input
            type="email"
            required
            name="email"
            placeholder="Email Address"
          />
          <div className={css["submit"]}>
            <Button
              disabled={isSubmitting}
              type="submit"
              loading={isSubmitting}
              fit
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MailingListModule;
