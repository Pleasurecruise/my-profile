export interface Bindings {
  // CF platform bindings (wrangler.toml)
  ASSETS: Fetcher;
  BLOG_BUCKET: R2Bucket;
  HYPERDRIVE: Hyperdrive;
  KV_NAMESPACE: KVNamespace;

  // Secrets Store / local .dev.vars fallback
  GITHUB_CLIENT_ID: string | SecretsStoreSecret;
  GITHUB_CLIENT_SECRET: string | SecretsStoreSecret;
  GOOGLE_CLIENT_ID: string | SecretsStoreSecret;
  GOOGLE_CLIENT_SECRET: string | SecretsStoreSecret;
  RESEND_API_KEY: string | SecretsStoreSecret;
  NOTION_TOKEN: string | SecretsStoreSecret;
  OPENAI_API_KEY: string | SecretsStoreSecret;
  AM_I_OK_SECRET: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  OPENAI_API_URL: string;
  OPENAI_MODEL: string;
  RESEND_FROM: string;
  VITE_MAPBOX_TOKEN: string;
}
