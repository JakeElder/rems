"use client";

import React, { InputHTMLAttributes } from "react";
import css from "./AiSearch.module.css";
import { Oval } from "react-loader-spinner";

type Props = {
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  value?: InputHTMLAttributes<HTMLInputElement>["value"];
};

const AiSearch = ({ onChange, value }: Props) => {
  return (
    <div className={css["root"]}>
      <form className={css["form"]}>
        <div className={css["input-and-spinner"]}>
          <div className={css["input-container"]}>
            <input
              className={css["input"]}
              autoComplete="off"
              style={{ borderColor: "transparent" }}
              name="query"
              value={value}
              onChange={onChange}
            />
            <button type="button" className={css["mic"]}></button>
          </div>
          {false && (
            <Oval
              height={22}
              width={22}
              color="#c19d54"
              secondaryColor="#c19d54"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default AiSearch;
