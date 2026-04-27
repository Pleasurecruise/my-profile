import { env as runtimeEnv } from "cloudflare:workers";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { getPrisma } from "./lib/prisma";
import { sendEmail } from "./lib/email";
const prisma = getPrisma(runtimeEnv.HYPERDRIVE.connectionString);

export const auth = betterAuth({
  secret: runtimeEnv.BETTER_AUTH_SECRET,
  baseURL: runtimeEnv.BETTER_AUTH_URL,
  trustedOrigins: [runtimeEnv.BETTER_AUTH_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail(runtimeEnv, {
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
      await sendEmail(runtimeEnv, {
        to: user.email,
        subject: "Verify your email address",
        html: `<a href="${url}">Click the link to verify your email</a>`,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: runtimeEnv.GITHUB_CLIENT_ID,
      clientSecret: runtimeEnv.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: runtimeEnv.GOOGLE_CLIENT_ID,
      clientSecret: runtimeEnv.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    fields: { expiresAt: "expiresAt", token: "token" },
    cookieCache: { enabled: true, maxAge: 30 * 60 },
  },
  database: prismaAdapter(prisma, { provider: "postgresql" }),
});

export type Auth = typeof auth;
