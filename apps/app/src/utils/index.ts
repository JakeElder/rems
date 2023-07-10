"use server";

import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function fetch(input: RequestInfo | URL, init: RequestInit = {}) {
  return global.fetch(input, {
    ...init,
    next: { revalidate: 10 },
    headers: { Authorization: `Bearer ${process.env.API_TOKEN}` }
  });
}

const FROM_EMAIL = "mailer@mindfulstudio.io";

const transporter = nodemailer.createTransport({
  host: "smtp.mailersend.net",
  port: 587,
  auth: {
    user: process.env.SENDMAIL_USER,
    pass: process.env.SENDMAIL_PASS
  }
});

export async function sendMail(options: Omit<Mail.Options, "from">) {
  const { to, subject, text } = options;
  return transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    text
  });
}

export default sendMail;
