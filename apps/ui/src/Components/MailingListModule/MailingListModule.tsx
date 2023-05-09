import React from "react";
import css from "./MailingListModule.module.css";

type Props = {};

const MailingListModule = ({}: Props) => {
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
        <form className={css["form"]}>
          <input type="email" placeholder="Email Address" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default MailingListModule;
