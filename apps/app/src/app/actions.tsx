"use server";

import { ContactAgentFormData, ServerAction } from "@rems/types";
import { sendMail } from "../utils";

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
