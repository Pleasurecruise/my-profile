import {
    betterAuth
} from 'better-auth';
import { nextCookies } from "better-auth/next-js";
import { cache } from "react";
import { headers } from "next/headers";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/server/prisma";
import { sendEmail } from "@/server/email";
// import { username } from "better-auth/plugins"
// import { emailOTP } from "better-auth/plugins"

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        // username(),
        // emailOTP({
        //     async sendVerificationOTP({ email, otp, type }) {
        //         if (type === "sign-in") {
        //             // Send the OTP for sign in
        //         } else if (type === "email-verification") {
        //             // Send the OTP for email verification
        //         } else {
        //             // Send the OTP for password reset
        //         }
        //     },
        // }),
        nextCookies()
    ],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        sendResetPassword: async ({user, url}, request) => {
            await sendEmail({
                to: user.email,
                subject: "Reset your password",
                html: `<a href="${url}">Click the link to verify your email</a>`
            });
        },
        onPasswordReset: async ({ user }, request) => {
            // your logic here
            console.log(`Password for user ${user.email} has been reset.`);
        },
    },
    // emailVerification: {
    //     sendVerificationEmail: async ( { user, url, token }, request) => {
    //         await sendEmail({
    //             to: user.email,
    //             subject: "Verify your email address",
    //             html: `<a href="${url}">Click the link to verify your email</a>`
    //         });
    //     },
    // },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    session: {
        fields: {
            expiresAt: "expiresAt",
            token: "token"
        },
        cookieCache: {
            enabled: true,
            maxAge: 30 * 60 // Cache duration in seconds
        }
    },

    /** if no database is provided, the user data will be stored in memory.
     * Make sure to provide a database to persist user data **/
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    })
});

export const getSession = cache(async () => {
    return await auth.api.getSession({
        headers: await headers()
    })
})
