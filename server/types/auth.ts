import { auth } from "../auth";

export type AuthSession = typeof auth.$Infer.Session;
export type AuthBindings = {
  Variables: {
    session: AuthSession["session"] | null;
    user: AuthSession["user"] | null;
  };
};
