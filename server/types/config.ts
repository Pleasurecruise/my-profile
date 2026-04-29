export type KvConfigKey =
  | "AM_I_OK_SECRET"
  | "BETTER_AUTH_SECRET"
  | "BETTER_AUTH_URL"
  | "OPENAI_API_URL"
  | "OPENAI_MODEL"
  | "RESEND_FROM"
  | "VITE_MAPBOX_TOKEN";

export type SecretBackedValue = string | SecretsStoreSecret | undefined;

export type ResolvedAuthConfig = {
  authSecret: string;
  authUrl: string;
  githubClientId: string;
  githubClientSecret: string;
  googleClientId: string;
  googleClientSecret: string;
};
