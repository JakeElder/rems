import React from "react";
import Script from "next/script";

type Props = {};

const Analytics = ({}: Props) => {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-ZKVXXQYEQE"
      />
      <Script id="analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ZKVXXQYEQE');
        `}
      </Script>
    </>
  );
};

export default Analytics;
