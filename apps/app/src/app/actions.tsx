"use server";

import { ContactFormSchema } from "@rems/schemas";
import { sendMail } from "../utils";
import nlToQueryUtil from "../utils/nl-to-query";
import { PartialRealEstateQuery } from "@rems/types";

export const submitMailingListForm = async (data: { email: string }) => {
  await sendMail({ subject: "New mailing list submission", data });
  return {};
};

export const submitContactForm = async (form: FormData) => {
  const data = ContactFormSchema.parse(Object.fromEntries(form));
  await sendMail({ subject: "New contact form submission", data });
  return {};
};

export const nlToQuery = async (query: PartialRealEstateQuery, nl: string) => {
  const res = await nlToQueryUtil(query, nl);
  return res;
};
