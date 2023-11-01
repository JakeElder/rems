import React from "react";
import md from "../src/md";

test("does stuff", () => {
  const output = md(
    <>
      <h1>words</h1>
      <p>Stuff</p>
      <ul>
        <li>yep</li>
      </ul>
    </>
  );

  console.log(output);

  expect("tests are").toBe("good");
});
