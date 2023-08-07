import Script from "next/script";
import React from "react";

type Props = {};

const ExternalScripts = ({}: Props) => {
  if (process.env.NEXT_PUBLIC_ENV !== "production") {
    return null;
  }

  return (
    <>
      <Script
        strategy="beforeInteractive"
        src="https://cdn.jsdelivr.net/npm/mapbox-gl@2.13.0/dist/mapbox-gl.min.js"
      />
    </>
  );
};

export default ExternalScripts;
