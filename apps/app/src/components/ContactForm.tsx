import React from "react";
import { ContactForm as View } from "@rems/ui";
import { Property } from "@rems/types";
import api from "../api";

type Props = {
  propertyId: Property["id"];
};

const ContactForm = async ({ propertyId }: Props) => {
  const property = await api.get.property(propertyId);
  return (
    <View.Root
      uid={property.uid}
      defaultMessage={`I'm interested in ${property.title}`}
    >
      <View.Controls />
      <View.Submit />
    </View.Root>
  );
};

export default ContactForm;
