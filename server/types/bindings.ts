import type { Assets, Hyperdrive, R2Bucket } from "./cloudflare";

export interface Bindings {
  // CF platform bindings (wrangler.toml)
  ASSETS: Assets;
  BLOG_BUCKET: R2Bucket;
  HYPERDRIVE: Hyperdrive;

  // Secrets (wrangler secret put / .dev.vars locally)
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  RESEND_API_KEY: string;
  RESEND_FROM: string;
  AM_I_OK_SECRET: string;
  NOTION_TOKEN: string;
  OPENAI_API_KEY: string;
  OPENAI_API_URL?: string;
  OPENAI_MODEL?: string;
  VITE_MAPBOX_TOKEN?: string;
}
