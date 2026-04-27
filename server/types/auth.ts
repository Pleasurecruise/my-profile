import type { Auth } from "../auth";

export type AuthSession = Auth["$Infer"]["Session"];
export type AuthBindings = {
  Variables: {
    session: AuthSession["session"] | null;
    user: AuthSession["user"] | null;
  };
};
