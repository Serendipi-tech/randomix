import nodemailer from 'nodemailer';
import { getPasswordResetEmailContent } from './emailTemplates/passwordReset';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(
  to: string,
  otp: string,
  language: string | null,
): Promise<void> {
  const { subject, html } = getPasswordResetEmailContent(language);
  await transporter.sendMail({
    from: `"RandoMIX" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: html(otp),
  });
}
