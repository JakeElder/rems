"use client";

import React from "react";
import css from "./MailingListModule.module.css";
import Button from "../../Elements/Button";
import { useServerAction } from "../../Utils/ServerActionProvider";
import { useToast } from "../ToastHub";

type Props = {};

const MailingListModule = ({ }: Props) => {
  const sa = useServerAction("submit-mailing-list-form");
  const { message } = useToast();

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
          onSubmit={async (e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const email = data.get("email")!.toString();
            const res = await sa.commit({ email });
            if (res.ok) {
              message({
                title: "Mailing List Joined!",
                message: (
                  <>
                    We've added <span style={{ fontWeight: 600 }}>{email}</span>{" "}
                    to our mailing list
                  </>
                ),
                timeout: 5000
              });
            }
          }}
        >
          <input
            type="email"
            required
            name="email"
            placeholder="Email Address"
          />
          <div className={css["submit"]}>
            <Button
              disabled={sa.pending}
              type="submit"
              loading={sa.pending}
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
