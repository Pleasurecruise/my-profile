import {authClient} from "./auth-client";

export const signinGithub = async () => {
    return await authClient.signIn.social({
        provider: "github",
        callbackURL: "/chat",
    });
};

export const signinGoogle = async () => {
    return await authClient.signIn.social({
        provider: "google",
        callbackURL: "/chat",
    });
};
