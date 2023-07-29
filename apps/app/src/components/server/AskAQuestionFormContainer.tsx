import { Property } from "@rems/types";
import AskAQuestionFormViewContainer from "@/components/client/AskAQuestionFormViewContainer";
import fetch from "@/fetch";

type Props = {
  propertyId: Property["id"];
};

const AskAQuestionFormContainer = async ({ propertyId }: Props) => {
  const property = await fetch("property", propertyId);
  return <AskAQuestionFormViewContainer uid={property.uid} />;
};

export default AskAQuestionFormContainer;
