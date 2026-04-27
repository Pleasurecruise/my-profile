import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { getConfig, getSecret } from "./lib/runtime-config";
import { getDb } from "./lib/db";
import * as schema from "./lib/schema";
import { sendEmail } from "./lib/email";
import type { Bindings } from "./types/bindings";
import type { ResolvedAuthConfig } from "./types/config";

async function createAuth(env: Bindings, config: ResolvedAuthConfig) {
  const authBaseUrl = new URL(config.authUrl);
  return betterAuth({
    secret: config.authSecret,
    baseURL: config.authUrl,
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
        clientId: config.githubClientId,
        clientSecret: config.githubClientSecret,
      },
      google: {
        clientId: config.googleClientId,
        clientSecret: config.googleClientSecret,
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

export type Auth = Awaited<ReturnType<typeof createAuth>>;

export async function getAuth(env: Bindings): Promise<Auth> {
  const config: ResolvedAuthConfig = {
    authSecret: await getConfig(env, "BETTER_AUTH_SECRET"),
    authUrl: await getConfig(env, "BETTER_AUTH_URL"),
    githubClientId: await getSecret(env.GITHUB_CLIENT_ID, "GITHUB_CLIENT_ID"),
    githubClientSecret: await getSecret(env.GITHUB_CLIENT_SECRET, "GITHUB_CLIENT_SECRET"),
    googleClientId: await getSecret(env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID"),
    googleClientSecret: await getSecret(env.GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET"),
  };

  return createAuth(env, config);
}
