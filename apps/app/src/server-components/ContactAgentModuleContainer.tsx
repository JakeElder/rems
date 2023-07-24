import { Property } from "@rems/types";
import api from "../api";
import ContactAgentModuleViewContainer from "../client-components/ContactAgentModuleViewContainer";

type Props = {
  propertyId: Property["id"];
};

const ContactAgentModuleContainer = async ({ propertyId }: Props) => {
  const property = await api.get.property(propertyId);
  return (
    <ContactAgentModuleViewContainer
      uid={property.uid}
      defaultMessage={`I'm intered in ${property.title}`}
    />
  );
};

export default ContactAgentModuleContainer;
