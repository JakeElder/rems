import fetch from "@/fetch";
import QuerySync from "@/components/client/QuerySync";

type Props = {
  children: React.ReactNode;
};

const QuerySyncContainer = async ({ children }: Props) => {
  const [
    propertyTypes,
    viewTypes,
    indoorFeatures,
    outdoorFeatures,
    lotFeatures
  ] = await Promise.all([
    fetch("property-types"),
    fetch("view-types"),
    fetch("indoor-features"),
    fetch("outdoor-features"),
    fetch("lot-features")
  ]);

  return (
    <QuerySync
      children={children}
      filters={{
        propertyTypes,
        viewTypes,
        outdoorFeatures,
        indoorFeatures,
        lotFeatures
      }}
    />
  );
};

export default QuerySyncContainer;
