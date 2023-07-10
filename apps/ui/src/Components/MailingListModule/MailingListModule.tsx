"use client";

import React from "react";
import css from "./MailingListModule.module.css";
import Button from "../../Elements/Button";

type Props = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  loading?: boolean;
};

const MailingListModule = ({ onSubmit, loading = false }: Props) => {
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
          <Button disabled={loading} type="submit">
            {loading ? "Loading" : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MailingListModule;
