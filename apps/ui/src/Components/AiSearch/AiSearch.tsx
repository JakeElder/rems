"use client";

import React, { useCallback, useState } from "react";
import css from "./AiSearch.module.css";
import useServerAction from "../../hooks/useServerAction";
import { ServerAction } from "@rems/types";
import TextInput from "../../Elements/TextInput";
import { Oval } from "react-loader-spinner";
import { debounce } from "throttle-debounce";

type Props = {
  search: ServerAction<{ query: string }>;
};

const AiSearch = ({ search }: Props) => {
  const sa = useServerAction(search);
  const [query, setQuery] = useState("");

  const update = useCallback(
    debounce(
      1000,
      async (query: string) => {
        if (query.length > 20) {
          sa.commit({ query });
        }
      },
      { atBegin: false }
    ),
    []
  );

  return (
    <div className={css["root"]}>
      <form className={css["form"]}>
        <div className={css["input-and-spinner"]}>
          <div className={css["input"]}>
            <TextInput
              autoComplete="off"
              style={{ borderColor: "transparent" }}
              type="text"
              name="query"
              value={query}
              onChange={(e) => {
                setQuery(e.currentTarget.value);
                update(query);
              }}
            />
          </div>
          {sa.pending && (
            <Oval
              height={22}
              width={22}
              color="#c19d54"
              secondaryColor="#c19d54"
            />
          )}
        </div>
        <pre style={{ background: "#444", color: "#ccc", padding: 20 }}>
          {sa.state === "activated"
            ? JSON.stringify(sa.result.data, null, 2)
            : ""}
        </pre>
      </form>
    </div>
  );
};

export default AiSearch;
