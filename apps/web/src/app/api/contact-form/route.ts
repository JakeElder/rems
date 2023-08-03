import { NextResponse } from "next/server";
import { sendMail } from "../../actions";
import { ContactFormSchema } from "@rems/schemas/src/contact-form";

export async function POST(req: Request) {
  const form = await req.formData();
  const data = ContactFormSchema.parse(Object.fromEntries(form));
  await sendMail({ subject: "New contact form submission", data });
  return NextResponse.json({});
}
