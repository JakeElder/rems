import React from "react";
import { ContactAgentModule as View } from "@rems/ui";
import { Property } from "@rems/types";
import api from "../api";
import { handleContactAgentFormSubmission } from "../app/actions";

type Props = {
  propertyId: Property["id"];
};

const ContactAgentModule = async ({ propertyId }: Props) => {
  const property = await api.get.property(propertyId);
  return <View uid={property.uid} commit={handleContactAgentFormSubmission} />;
};

export default ContactAgentModule;
