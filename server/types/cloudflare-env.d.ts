declare global {
  namespace Cloudflare {
    interface Env {
      ASSETS: Fetcher;
      BLOG_BUCKET: R2Bucket;
      HYPERDRIVE: Hyperdrive;
      KV_NAMESPACE: KVNamespace;
    }
  }

  interface Env extends Cloudflare.Env {}
}

declare module "void/handler" {
  interface CloudBindings {
    ASSETS: Fetcher;
    BLOG_BUCKET: R2Bucket;
    HYPERDRIVE: Hyperdrive;
    KV_NAMESPACE: KVNamespace;
  }
}

export {};
