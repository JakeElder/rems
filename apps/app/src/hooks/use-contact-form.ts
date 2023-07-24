import { ContactFormData, contactFormDataSchema } from "@rems/types";
import { ContactForm, useToast } from "@rems/ui";
import { useState } from "react";

type ContactFormProps = React.ComponentProps<typeof ContactForm.Root>;
type Fetcher = (data: ContactFormData) => Promise<{}>;

const useContactForm = (fetcher: Fetcher, onComplete?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message } = useToast();

  const onSubmit: ContactFormProps["onSubmit"] = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = contactFormDataSchema.parse(Object.fromEntries(form));

    setIsSubmitting(true);
    await fetcher(data);

    message({
      title: "Message Sent",
      message: "One of our agents will get back to you as soon as possible.",
      timeout: 3000
    });

    setIsSubmitting(false);
    onComplete?.();
  };

  return { onSubmit, isSubmitting };
};

export default useContactForm;
