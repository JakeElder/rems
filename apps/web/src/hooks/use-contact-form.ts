import { ContactForm, useToast } from "@rems/ui";
import { useState } from "react";

type ContactFormProps = React.ComponentProps<typeof ContactForm.Root>;
type Fetcher = (data: FormData) => Promise<{}>;

const useContactForm = (fetcher: Fetcher, onComplete?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message } = useToast();

  const onSubmit: ContactFormProps["onSubmit"] = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    await fetcher(new FormData(e.currentTarget));

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
