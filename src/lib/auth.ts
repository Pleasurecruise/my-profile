import {
    betterAuth
} from 'better-auth';
import { nextCookies } from "better-auth/next-js";
import { cache } from "react";
import { headers } from "next/headers";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        async sendResetPassword(data, request) {
            // Send an email to the user with a link to reset their password
            console.log("Reset password URL:", data.url);
        },
    },
    plugins: [
        nextCookies()
    ],
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }
    },
    session: {
        fields: {
            expiresAt: "expiresAt",
            token: "token"
        }
    },

    /** if no database is provided, the user data will be stored in memory.
     * Make sure to provide a database to persist user data **/
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    })
});

export const getSession = cache(async () => {
    return await auth.api.getSession({
        headers: await headers()
    })
})