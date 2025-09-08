import {
    createAuthClient
} from "better-auth/react";
// import { emailOTPClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL || "https://www.yiming1234.cn",
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