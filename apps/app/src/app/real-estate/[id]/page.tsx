import { RealEstatePage } from "@rems/ui/src";
import api from "../../../api";

export default async function Home({ params }: any) {
  const property = await api.get.property(params.id.split("-").slice(-1));
  return <RealEstatePage property={property} />;
}
