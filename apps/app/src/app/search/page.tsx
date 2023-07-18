import { ServerActions } from "@rems/types";
import { AiSearch, ServerActionProvider } from "@rems/ui";
import { nlToQuery } from "../actions";

export default async function Home() {
  const serverActions: Partial<ServerActions> = {
    "nl-to-query": nlToQuery
  };

  return (
    <ServerActionProvider value={serverActions}>
      <AiSearch />
    </ServerActionProvider>
  );
}
