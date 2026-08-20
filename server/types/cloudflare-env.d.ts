declare global {
  namespace Cloudflare {
    interface Env {
      ASSETS: Fetcher;
      HYPERDRIVE: Hyperdrive;
    }
  }

  interface Env extends Cloudflare.Env {}
}

declare module "void/handler" {
  interface CloudBindings {
    ASSETS: Fetcher;
    HYPERDRIVE: Hyperdrive;
  }
}

export {};
