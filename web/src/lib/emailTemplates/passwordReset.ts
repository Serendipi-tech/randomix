type PasswordResetEmailContent = {
  subject: string;
  html: (otp: string) => string;
};

// Aggiungere qui le nuove lingue quando disponibili (es. 'it', 'es')
const TEMPLATES: Record<string, PasswordResetEmailContent> = {
  en: {
    subject: 'RandoMIX — Password recovery',
    html: (otp) => `
      <div style="font-family: sans-serif; max-width: 420px; margin: 0 auto; padding: 24px;">
        <h2 style="margin-bottom: 8px;">Password recovery</h2>
        <p style="color: #555;">Your verification code is:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; margin: 24px 0; color: #6C63FF;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 14px;">
          Expires in 1 hour. If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  },
};

export function getPasswordResetEmailContent(language: string | null): PasswordResetEmailContent {
  return TEMPLATES[language ?? 'en'] ?? TEMPLATES.en;
}
