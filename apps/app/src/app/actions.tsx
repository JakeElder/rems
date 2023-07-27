"use server";

import { ContactFormSchema } from "@rems/schemas";
import { sendMail } from "../utils";

export const submitMailingListForm = async (data: { email: string }) => {
  await sendMail({ subject: "New mailing list submission", data });
  return {};
};

export const submitContactForm = async (form: FormData) => {
  const data = ContactFormSchema.parse(Object.fromEntries(form));
  await sendMail({ subject: "New contact form submission", data });
  return {};
};
