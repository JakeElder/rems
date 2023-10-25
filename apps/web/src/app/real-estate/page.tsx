import { Metadata } from "next";
import { RealEstateIndexPage as Page } from "@rems/ui";
import fetch from "@/fetch";
import QuickFiltersContainer from "@/components/server/QuickFiltersContainer";
import StateProviderContainer from "@/components/server/StateProviderContainer";
import QuerySync from "@/components/client/QuerySync";
import { SearchParams } from "@rems/types";

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
    <StateProviderContainer searchParams={searchParams || {}}>
      <QuerySync>
        <Page.Root>
          <QuickFiltersContainer />
        </Page.Root>
      </QuerySync>
    </StateProviderContainer>
  );
}
