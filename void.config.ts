import { defineConfig } from "void/config";

export default defineConfig({
  target: "cloudflare",
  routing: {
    notFound: "404-page",
  },
  inference: {
    appType: "void",
  },
  cloudflare: {
    name: "my-profile",
    account_id: "fb71c4eceaf623ae1b19b8b37d7a38cf",
    compatibility_date: "2026-08-01",
    compatibility_flags: ["nodejs_compat"],
    upload_source_maps: true,
    workers_dev: false,
    preview_urls: false,
    routes: [
      {
        pattern: "you-find.me",
        custom_domain: true,
      },
    ],
    placement: {
      mode: "smart",
    },
    d1_databases: [
      {
        binding: "DB",
        database_name: "my-profile",
        migrations_dir: "./db/migrations",
      },
    ],
    observability: {
      logs: {
        enabled: true,
        invocation_logs: true,
      },
      traces: {
        enabled: true,
      },
    },
  },
});
