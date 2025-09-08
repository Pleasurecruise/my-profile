import {
    createAuthClient
} from "better-auth/react";
// import { emailOTPClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    // plugins: [
    //     emailOTPClient()
    // ]
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;