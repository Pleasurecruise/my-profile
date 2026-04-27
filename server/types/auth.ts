import type { Auth } from "../auth";
import type { Bindings } from "./bindings";

export type AuthSession = Auth["$Infer"]["Session"];
export type ServerEnv = { Bindings: Bindings };
export type AuthBindings = {
  Variables: {
    session: AuthSession["session"] | null;
    user: AuthSession["user"] | null;
  };
};
export type AuthEnv = AuthBindings & ServerEnv;
