import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";
import { env } from "@/lib/env";
import { sendEmail } from "@/server/email";
import prisma from "@/server/prisma";

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	plugins: [nextCookies()],
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
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
		fields: {
			expiresAt: "expiresAt",
			token: "token",
		},
		cookieCache: {
			enabled: true,
			maxAge: 30 * 60, // Cache duration in seconds
		},
	},

	/** if no database is provided, the user data will be stored in memory.
	 * Make sure to provide a database to persist user data **/
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
});

export const getSession = cache(async () => {
	return await auth.api.getSession({
		headers: await headers(),
	});
});
