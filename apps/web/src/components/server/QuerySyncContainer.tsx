import fetch from "@/fetch";
import QuerySync from "@/components/client/QuerySync";

type Props = {
  children: React.ReactNode;
};

const QuerySyncContainer = async ({ children }: Props) => {
  const filters = await fetch("array-filters");
  return <QuerySync children={children} filters={filters} />;
};

export default QuerySyncContainer;
