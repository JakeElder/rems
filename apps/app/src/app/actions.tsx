"use server";

import { ContactFormData, ServerAction } from "@rems/types";
import { sendMail } from "../utils";
import nlToQueryUtil from "../utils/nl-to-query";

export const submitMailingListForm: ServerAction<{
  email: string;
}> = async (data, uuid) => {
  await sendMail({ subject: "New mailing list submission", data });
  return { ok: true, uuid, data: {} };
};

export const submitContactForm: ServerAction<ContactFormData> = async (
  data,
  uuid
) => {
  await sendMail({ subject: "New contact form submission", data });
  return { ok: true, uuid, data: {} };
};

export const nlToQuery: ServerAction<{ query: string }> = async (
  { query },
  uuid
) => {
  const res = await nlToQueryUtil(query);
  return { ok: true, uuid, data: res };
};
