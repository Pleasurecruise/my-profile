import { Resend } from "resend";
import type { Bindings } from "../types/bindings";

type SendEmailOptions =
  | { to: string; subject: string; text: string; html?: string }
  | { to: string; subject: string; html: string; text?: string };

export async function sendEmail(env: Bindings, options: SendEmailOptions) {
  const resend = new Resend(env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM,
    ...options,
  });
  if (error) throw new Error(error.message);
  console.log("Email sent:", data?.id);
  return { success: true, messageId: data?.id };
}
