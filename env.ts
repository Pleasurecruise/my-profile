import { defineEnv, email, string, url } from "void/env";

export default defineEnv({
  OPENAI_API_URL: url(),
  OPENAI_MODEL: string(),
  RESEND_FROM: email(),

  BETTER_AUTH_SECRET: string().secret(),
  GITHUB_CLIENT_ID: string().secret(),
  GITHUB_CLIENT_SECRET: string().secret(),
  GOOGLE_CLIENT_ID: string().secret(),
  GOOGLE_CLIENT_SECRET: string().secret(),
  OPENAI_API_KEY: string().secret(),
  RESEND_API_KEY: string().secret(),
});
