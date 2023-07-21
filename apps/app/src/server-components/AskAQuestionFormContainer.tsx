import { Property } from "@rems/types";
import api from "../api";
import AskAQuestionFormViewContainer from "../client-components/AskAQuestionFormViewContainer";

type Props = {
  propertyId: Property["id"];
};

const AskAQuestionFormContainer = async ({ propertyId }: Props) => {
  const property = await api.get.property(propertyId);
  return <AskAQuestionFormViewContainer uid={property.uid} />;
};

export default AskAQuestionFormContainer;
