import { Suspense } from "react";
import FiltersContainer from "../../server-components/FiltersContainer";

const AsyncComp = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return null;
};

export default async function Home() {
  return (
    <>
      <Suspense>
        <AsyncComp />
      </Suspense>
      <Suspense>
        <FiltersContainer />
      </Suspense>
    </>
  );
}
