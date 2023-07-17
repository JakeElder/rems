import { AiSearch } from "@rems/ui";
import { handleAiSearchQuery } from "../actions";

export default async function Home() {
  return <AiSearch search={handleAiSearchQuery} />;
}
