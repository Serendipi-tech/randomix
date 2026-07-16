import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(to: string, otp: string): Promise<void> {
  await transporter.sendMail({
    from: `"RandoMIX" <${process.env.SMTP_USER}>`,
    to,
    subject: 'RandoMIX — Recupero password',
    html: `
      <div style="font-family: sans-serif; max-width: 420px; margin: 0 auto; padding: 24px;">
        <h2 style="margin-bottom: 8px;">Recupero password</h2>
        <p style="color: #555;">Il tuo codice di verifica è:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; margin: 24px 0; color: #6C63FF;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 14px;">
          Scade tra 1 ora. Se non hai richiesto il reset, ignora questa email.
        </p>
      </div>
    `,
  });
}
