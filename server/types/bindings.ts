import type { Assets, Hyperdrive, KVNamespace, R2Bucket, SecretStoreSecret } from "./cloudflare";

export interface Bindings {
  // CF platform bindings (wrangler.toml)
  ASSETS: Assets;
  BLOG_BUCKET: R2Bucket;
  HYPERDRIVE: Hyperdrive;
  KV_NAMESPACE: KVNamespace;

  // Secrets Store / local .dev.vars fallback
  DATABASE_URL: string | SecretStoreSecret;
  GITHUB_CLIENT_ID: string | SecretStoreSecret;
  GITHUB_CLIENT_SECRET: string | SecretStoreSecret;
  GOOGLE_CLIENT_ID: string | SecretStoreSecret;
  GOOGLE_CLIENT_SECRET: string | SecretStoreSecret;
  RESEND_API_KEY: string | SecretStoreSecret;
  NOTION_TOKEN: string | SecretStoreSecret;
  OPENAI_API_KEY: string | SecretStoreSecret;
  AM_I_OK_SECRET: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  OPENAI_API_URL: string;
  OPENAI_MODEL: string;
  RESEND_FROM: string;
  VITE_MAPBOX_TOKEN: string;
}
