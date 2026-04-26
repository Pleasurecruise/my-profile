import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createEnv } from "@t3-oss/env-core";
import { config as loadEnv } from "dotenv";
import { z } from "zod";

const rootDir = resolve(fileURLToPath(new URL("../..", import.meta.url)));

loadEnv({ path: resolve(rootDir, ".env"), override: true });

export const env = createEnv({
  server: {
    ALI_OSS_ACCESS_KEY_ID: z.string().min(1),
    ALI_OSS_ACCESS_KEY_SECRET: z.string().min(1),
    ALI_OSS_BLOG_PREFIX: z.string().min(1).default("blog"),
    ALI_OSS_BUCKET: z.string().min(1),
    ALI_OSS_REGION: z.string().min(1),
    AM_I_OK_SECRET: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
    DATABASE_URL: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    MAIL_AUTH_PASS: z.string().min(1),
    MAIL_AUTH_USER: z.string().min(1),
    MAIL_FROM: z.string().min(1),
    MAIL_HOST: z.string().min(1),
    MAIL_PORT: z.coerce.number().int().positive(),
    MAIL_SECURE: z.enum(["true", "false"]).transform((v) => v === "true"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    OPENAI_API_KEY: z.string().min(1),
    OPENAI_API_URL: z.url().optional(),
    OPENAI_MODEL: z.string().min(1).optional(),
    PORT: z.coerce.number().int().positive().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
