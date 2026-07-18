import { defineAuth } from "void/auth";
import { env, type ValidatedEnv } from "void/env";
import { Resend } from "resend";

type SendEmailOptions =
  | { to: string; subject: string; text: string; html?: string }
  | { to: string; subject: string; html: string; text?: string };

type SocialEnv = Partial<
  Pick<
    ValidatedEnv,
    "GITHUB_CLIENT_ID" | "GITHUB_CLIENT_SECRET" | "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET"
  >
>;

async function sendEmail(options: SendEmailOptions) {
  const resend = new Resend(env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM,
    ...options,
  });

  if (error) throw new Error(error.message);
  console.log("Email sent:", data?.id);
}

export default defineAuth(({ defaults, env: authEnv, request }) => {
  const requestOrigin = new URL(request.url).origin;
  const {
    GITHUB_CLIENT_ID: githubClientId,
    GITHUB_CLIENT_SECRET: githubClientSecret,
    GOOGLE_CLIENT_ID: googleClientId,
    GOOGLE_CLIENT_SECRET: googleClientSecret,
  } = authEnv as SocialEnv;
  const socialProviders =
    githubClientId && githubClientSecret && googleClientId && googleClientSecret
      ? {
          github: { clientId: githubClientId, clientSecret: githubClientSecret },
          google: { clientId: googleClientId, clientSecret: googleClientSecret },
        }
      : undefined;

  return {
    ...defaults,
    trustedOrigins: [
      ...new Set([
        requestOrigin,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://[::1]:5173",
      ]),
    ],
    advanced: {
      ...defaults.advanced,
      useSecureCookies: new URL(request.url).protocol === "https:",
    },
    emailAndPassword: {
      ...defaults.emailAndPassword,
      enabled: true,
      requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Reset your password",
          html: `<a href="${url}">Click the link to reset your password</a>`,
        });
      },
      onPasswordReset: async ({ user }) => {
        console.log(`Password for user ${user.email} has been reset.`);
      },
    },
    emailVerification: {
      ...defaults.emailVerification,
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Verify your email address",
          html: `<a href="${url}">Click the link to verify your email</a>`,
        });
      },
    },
    ...(socialProviders ? { socialProviders } : {}),
    account: {
      ...defaults.account,
      encryptOAuthTokens: true,
    },
    session: {
      ...defaults.session,
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
  };
});
