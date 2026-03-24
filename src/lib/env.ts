import { z } from "zod";

const nonEmptyString = z.string().trim().min(1);
const optionalNonEmptyString = z
	.string()
	.trim()
	.transform((v) => (v === "" ? undefined : v))
	.pipe(z.string().optional());

const optionalUrl = z
	.string()
	.trim()
	.transform((v) => (v === "" ? undefined : v))
	.pipe(z.url().optional());

const serverEnvSchema = z.object({
	ALI_OSS_ACCESS_KEY_ID: nonEmptyString,
	ALI_OSS_ACCESS_KEY_SECRET: nonEmptyString,
	ALI_OSS_BLOG_PREFIX: nonEmptyString.default("blog"),
	ALI_OSS_BUCKET: nonEmptyString,
	ALI_OSS_REGION: nonEmptyString,
	AM_I_OK_SECRET: nonEmptyString,
	BETTER_AUTH_SECRET: nonEmptyString,
	BETTER_AUTH_URL: z.url(),
	DATABASE_URL: nonEmptyString,
	GITHUB_CLIENT_ID: nonEmptyString,
	GITHUB_CLIENT_SECRET: nonEmptyString,
	GOOGLE_CLIENT_ID: nonEmptyString,
	GOOGLE_CLIENT_SECRET: nonEmptyString,
	MAIL_AUTH_PASS: nonEmptyString,
	MAIL_AUTH_USER: nonEmptyString,
	MAIL_FROM: nonEmptyString,
	MAIL_HOST: nonEmptyString,
	MAIL_PORT: z.coerce.number().int().positive(),
	MAIL_SECURE: z.enum(["true", "false"]).transform((value) => value === "true"),
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
	OPENAI_API_KEY: nonEmptyString,
	OPENAI_API_URL: optionalUrl,
	OPENAI_MODEL: optionalNonEmptyString,
	PORT: z.coerce.number().int().positive().optional(),
	POSTGRES_URL: optionalNonEmptyString,
	PRISMA_DATABASE_URL: optionalNonEmptyString,
	VERCEL_OIDC_TOKEN: optionalNonEmptyString,
	VERCEL_URL: optionalNonEmptyString,
});

export const env = serverEnvSchema.parse(process.env);
