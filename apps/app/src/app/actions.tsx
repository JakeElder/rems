"use server";

import { ServerAction } from "@rems/types";
import { sendMail } from "../utils";

export const handleMailingListModuleSubmission: ServerAction<{
  email: string;
}> = async (params, uuid) => {
  await sendMail({
    subject: "[REMS] New mailing list submission",
    data: params
  });
  return { ok: true, uuid, data: {} };
};
