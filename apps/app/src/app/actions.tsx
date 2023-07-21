"use server";

import { ContactFormData, ServerAction } from "@rems/types";
import { sendMail } from "../utils";
import nlToQueryUtil from "../utils/nl-to-query";

export const submitMailingListForm = async (data: { email: string }) => {
  await sendMail({ subject: "New mailing list submission", data });
  return {};
};

export const submitContactForm = async (data: ContactFormData) => {
  await sendMail({ subject: "New contact form submission", data });
  return {};
};

export const nlToQuery: ServerAction<{ query: string }> = async (
  { query },
  uuid
) => {
  const res = await nlToQueryUtil(query);
  return { ok: true, uuid, data: res };
};
