import { Resend } from "resend";

type SendEmailOptions =
  | { to: string; subject: string; text: string; html?: string }
  | { to: string; subject: string; html: string; text?: string };

export async function sendEmail(env: Cloudflare.Env, options: SendEmailOptions) {
  const resendApiKey = env.RESEND_API_KEY;
  const resendFrom = env.RESEND_FROM;
  const resend = new Resend(resendApiKey);
  const { data, error } = await resend.emails.send({
    from: resendFrom,
    ...options,
  });
  if (error) throw new Error(error.message);
  console.log("Email sent:", data?.id);
  return { success: true, messageId: data?.id };
}
