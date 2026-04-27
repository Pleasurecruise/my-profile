import { Resend } from "resend";
import { getConfig, getSecret } from "./runtime-config";
import type { Bindings } from "../types/bindings";

type SendEmailOptions =
  | { to: string; subject: string; text: string; html?: string }
  | { to: string; subject: string; html: string; text?: string };

export async function sendEmail(env: Bindings, options: SendEmailOptions) {
  const resendApiKey = await getSecret(env.RESEND_API_KEY, "RESEND_API_KEY");
  const resendFrom = await getConfig(env, "RESEND_FROM");
  const resend = new Resend(resendApiKey);
  const { data, error } = await resend.emails.send({
    from: resendFrom,
    ...options,
  });
  if (error) throw new Error(error.message);
  console.log("Email sent:", data?.id);
  return { success: true, messageId: data?.id };
}
