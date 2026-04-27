import { betterAuth } from "better-auth";
import { getDb } from "./lib/db";
import { sendEmail } from "./lib/email";
import type { Bindings } from "./types/bindings";

export function getAuth(env: Bindings) {
  const db = getDb(env.HYPERDRIVE.connectionString);

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [env.BETTER_AUTH_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await sendEmail(env, {
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
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmail(env, {
          to: user.email,
          subject: "Verify your email address",
          html: `<a href="${url}">Click the link to verify your email</a>`,
        });
      },
    },
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    session: {
      fields: { expiresAt: "expiresAt", token: "token" },
      cookieCache: { enabled: true, maxAge: 30 * 60 },
    },
    database: { db, type: "postgres" },
  });
}

export type Auth = ReturnType<typeof getAuth>;
