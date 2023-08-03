"use server";

import { ContactFormSchema } from "@rems/schemas";
import nodemailer from "nodemailer";
import fetch from "@/fetch";
import prettyjson from "prettyjson";

const FROM_EMAIL = `"Rems" <mailer@mindfulstudio.io>`;

const transporter = nodemailer.createTransport({
  host: "smtp.mailersend.net",
  port: 587,
  auth: {
    user: process.env.SENDMAIL_USER,
    pass: process.env.SENDMAIL_PASS
  }
});

export const sendMail = async ({
  subject,
  data
}: {
  subject: string;
  data: Record<string, any>;
}) => {
  const { notificationEmail } = await fetch("app-config");
  const { renderToString } = await import("react-dom/server");
  return transporter.sendMail({
    from: FROM_EMAIL,
    to: notificationEmail,
    subject: `${subject}`,
    html: renderToString(
      <pre style={{ padding: 30, border: "1px solid #888" }}>
        {prettyjson.render(data, { noColor: true })}
      </pre>
    ),
    text: prettyjson.render(data, { noColor: true })
  });
};

export const submitMailingListForm = async (data: { email: string }) => {
  await sendMail({ subject: "New mailing list submission", data });
  return {};
};

export const submitContactForm = async (form: FormData) => {
  const data = ContactFormSchema.parse(Object.fromEntries(form));
  await sendMail({ subject: "New contact form submission", data });
  return {};
};
