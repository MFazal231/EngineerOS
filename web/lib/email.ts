/**
 * Whether email verification is actually active. False when no Resend key
 * is configured, so registration/login behave exactly as before (immediate
 * access) until a key is added — same "no-op until configured" pattern as
 * the AI features.
 */
export function isEmailVerificationEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return;
  }

  const baseUrl = process.env.APP_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify?token=${token}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "EngineerOS <onboarding@resend.dev>",
      to,
      subject: "Verify your EngineerOS account",
      html: `
        <p>Hi ${escapeHtml(name)},</p>
        <p>Click below to verify your email and activate your EngineerOS account:</p>
        <p><a href="${verifyUrl}">Verify my email</a></p>
        <p>This link expires in 24 hours. If you didn't create this account, you can ignore this email.</p>
      `,
    }),
  });

  if (!response.ok) {
    console.error("Failed to send verification email:", response.status, await response.text());
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char];
  });
}
