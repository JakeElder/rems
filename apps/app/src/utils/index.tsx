"use server";

import nodemailer from "nodemailer";
import api from "../api";
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

export async function sendMail({
  subject,
  data
}: {
  subject: string;
  data: Record<string, any>;
}) {
  const { notificationEmail } = await api.get.appConfig();
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
}

export default sendMail;
