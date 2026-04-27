import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { getConfig, getSecret } from "./lib/runtime-config";
import { sendEmail } from "./lib/email";
import { getPrisma } from "./lib/prisma";
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
    database: prismaAdapter(getPrisma(config.databaseUrl), { provider: "postgresql" }),
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

const authInstances = new Map<string, Auth>();

export async function getAuth(env: Bindings): Promise<Auth> {
  const config: ResolvedAuthConfig = {
    databaseUrl: await getSecret(env.DATABASE_URL, "DATABASE_URL"),
    authSecret: await getConfig(env, "BETTER_AUTH_SECRET"),
    authUrl: await getConfig(env, "BETTER_AUTH_URL"),
    githubClientId: await getSecret(env.GITHUB_CLIENT_ID, "GITHUB_CLIENT_ID"),
    githubClientSecret: await getSecret(env.GITHUB_CLIENT_SECRET, "GITHUB_CLIENT_SECRET"),
    googleClientId: await getSecret(env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID"),
    googleClientSecret: await getSecret(env.GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET"),
  };
  const cacheKey = [
    config.databaseUrl,
    config.authSecret,
    config.authUrl,
    config.githubClientId,
    config.githubClientSecret,
    config.googleClientId,
    config.googleClientSecret,
  ].join("\0");
  const existingAuth = authInstances.get(cacheKey);
  if (existingAuth) return existingAuth;

  const auth = await createAuth(env, config);

  authInstances.set(cacheKey, auth);
  return auth;
}
