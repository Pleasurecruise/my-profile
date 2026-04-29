import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { getDb } from "./lib/db";
import * as schema from "./lib/schema";
import { sendEmail } from "./lib/email";

export function getAuth(env: Cloudflare.Env) {
  const authBaseUrl = new URL(env.BETTER_AUTH_URL);

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [
      authBaseUrl.origin,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://[::1]:5173",
    ],
    advanced: {
      useSecureCookies: authBaseUrl.protocol === "https:",
    },
    database: drizzleAdapter(getDb(env.HYPERDRIVE.connectionString), {
      provider: "pg",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
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
    account: {
      encryptOAuthTokens: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
  });
}

export type Auth = ReturnType<typeof getAuth>;
