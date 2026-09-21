import { defineEnv, email, string, url } from "void/env";

export default defineEnv({
  OPENAI_API_URL: url(),
  OPENAI_MODEL: string(),
  RESEND_FROM: email(),

  BETTER_AUTH_SECRET: string(),
  GITHUB_CLIENT_ID: string(),
  GITHUB_CLIENT_SECRET: string(),
  GOOGLE_CLIENT_ID: string(),
  GOOGLE_CLIENT_SECRET: string(),
  OPENAI_API_KEY: string(),
  RESEND_API_KEY: string(),
});
