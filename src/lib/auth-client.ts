import { auth } from "void/client/react";

export const authClient = auth;

export const { signIn, signOut, signUp, useSession } = authClient;
