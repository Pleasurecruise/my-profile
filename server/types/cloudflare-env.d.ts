declare global {
  namespace Cloudflare {
    interface Env {
      ASSETS: Fetcher;
      BLOG_BUCKET: R2Bucket;
      HYPERDRIVE: Hyperdrive;

      GITHUB_CLIENT_ID: string;
      GOOGLE_CLIENT_ID: string;
      BETTER_AUTH_URL: string;
      OPENAI_API_URL: string;
      OPENAI_MODEL: string;
      RESEND_FROM: string;
      VITE_MAPBOX_TOKEN: string;

      AM_I_OK_SECRET: string;
      BETTER_AUTH_SECRET: string;
      GITHUB_CLIENT_SECRET: string;
      GOOGLE_CLIENT_SECRET: string;
      RESEND_API_KEY: string;
      NOTION_TOKEN: string;
      OPENAI_API_KEY: string;
    }
  }

  interface Env extends Cloudflare.Env {}
}

export {};
