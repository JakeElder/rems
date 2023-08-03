import { Property } from "@rems/types";
import ContactAgentModuleViewContainer from "@/components/client/ContactAgentModuleViewContainer";
import fetch from "@/fetch";

type Props = {
  propertyId: Property["id"];
};

const ContactAgentModuleContainer = async ({ propertyId }: Props) => {
  const property = await fetch("property", propertyId);
  return (
    <ContactAgentModuleViewContainer
      uid={property.uid}
      defaultMessage={`I'm interested in ${property.title}`}
    />
  );
};

export default ContactAgentModuleContainer;
