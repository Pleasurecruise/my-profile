import {authClient} from "./auth-client";

export const signinGithub = async () => {
    return await authClient.signIn.social({
        provider: "github",
    });
};

export const signinGoogle = async () => {
    return await authClient.signIn.social({
        provider: "google",
    });
};
