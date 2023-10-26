import { Metadata } from "next";
import { RealEstateIndexPage as Page } from "@rems/ui";
import fetch from "@/fetch";
import StateProviderContainer from "@/components/server/StateProviderContainer";
import { SearchParams } from "@rems/types";
import FilterBarContainer from "@/components/server/FilterBarContainer";
import QuerySyncContainer from "@/components/server/QuerySyncContainer";

type Props = { searchParams?: SearchParams };

export async function generateMetadata(): Promise<Metadata> {
  const config = await fetch("app-config");
  return {
    title: config.defaultTitle,
    description: config.defaultDescription
  };
}

export default async function RealEstateIndexPage({ searchParams }: Props) {
  return (
    <StateProviderContainer searchParams={searchParams}>
      <QuerySyncContainer>
        <Page.Root>
          <FilterBarContainer />
        </Page.Root>
      </QuerySyncContainer>
    </StateProviderContainer>
  );
}
