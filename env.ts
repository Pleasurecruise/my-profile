import { defineEnv, email, string, url } from "void/env";

export default defineEnv({
  OPENAI_API_URL: url().default("https://api.siliconflow.cn/v1"),
  OPENAI_MODEL: string().default("deepseek-ai/DeepSeek-V4-Flash"),
  RESEND_FROM: email().default("pleasure@yiming1234.cn"),

  BETTER_AUTH_SECRET: string(),
  GITHUB_CLIENT_ID: string(),
  GITHUB_CLIENT_SECRET: string(),
  GOOGLE_CLIENT_ID: string(),
  GOOGLE_CLIENT_SECRET: string(),
  OPENAI_API_KEY: string(),
  RESEND_API_KEY: string(),
});
