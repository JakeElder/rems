import { NextResponse } from "next/server";
import { contactFormDataSchema } from "@rems/types";
import sendMail from "../../../utils";

export async function POST(req: Request) {
  const form = await req.formData();
  const data = contactFormDataSchema.parse(Object.fromEntries(form));
  await sendMail({ subject: "New contact form submission", data });
  return NextResponse.json({});
}
