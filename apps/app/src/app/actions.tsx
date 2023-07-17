"use server";

import { ContactAgentFormData, ServerAction } from "@rems/types";
import { sendMail } from "../utils";
import nlToQuery from "../utils/nl-to-query";

export const handleMailingListModuleSubmission: ServerAction<{
  email: string;
}> = async (data, uuid) => {
  await sendMail({ subject: "[REMS] New mailing list submission", data });
  return { ok: true, uuid, data: {} };
};

export const handleContactAgentFormSubmission: ServerAction<
  ContactAgentFormData
> = async (data, uuid) => {
  await sendMail({ subject: "[REMS] New contact form submission", data });
  return { ok: true, uuid, data: {} };
};

export const handleAiSearchQuery: ServerAction<{ query: string }> = async (
  { query },
  uuid
) => {
  const res = await nlToQuery(query);
  return { ok: true, uuid, data: res };
};
