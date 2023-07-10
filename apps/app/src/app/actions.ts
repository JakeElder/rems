"use server";

import { sendMail } from "../utils";

export async function handleSubmission(email: string) {
  const res = await sendMail({
    to: "jake@mindfulstudio.io",
    subject: "New mailing list submission",
    text: `New mailling list submission: ${email}`
  });

  return res;
}
