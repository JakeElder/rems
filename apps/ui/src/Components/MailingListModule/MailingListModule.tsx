"use client";

import React from "react";
import css from "./MailingListModule.module.css";
import Button from "../../Elements/Button";
import { ServerAction } from "@rems/types";
import useServerAction from "../../hooks/useServerAction";

type Props = {
  commit: ServerAction<{ email: string }>;
};

const MailingListModule = ({ commit }: Props) => {
  const sa = useServerAction(commit);

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
        <form
          className={css["form"]}
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const email = data.get("email");
            sa.commit({ email: email!.toString() });
          }}
        >
          <input
            type="email"
            required
            name="email"
            placeholder="Email Address"
          />
          <Button disabled={sa.pending} type="submit" loading={sa.pending}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MailingListModule;
