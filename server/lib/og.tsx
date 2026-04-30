import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";

const SITE_TITLE = "Pleasure1234";
const SITE_DESCRIPTION = "Full-stack Developer · Any shortcomings are kindly overlooked. 🙏";
const SITE_URL = "you-find.me";
const AVATAR_URL = "https://avatars.githubusercontent.com/u/144885467";
const W = 1200;
const H = 630;

export type OgImageParams =
  | { type: "home" }
  | { type: "blog"; title: string; description?: string };

export function generateOgImageResponse(params: OgImageParams): Response {
  const isHome = params.type === "home";
  const title = isHome ? SITE_TITLE : params.title;
  const description = isHome ? SITE_DESCRIPTION : params.description;
  const titleSize = isHome ? 76 : title.length > 36 ? 52 : 64;

  return new ImageResponse(
    <div
      style={{
        width: W,
        height: H,
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0a",
        fontFamily: "sans-serif",
        overflow: "hidden",
        padding: "56px 72px",
      }}
    >
      {/* decorative layers — all absolute, don't affect flow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -160,
          right: -160,
          width: 520,
          height: 520,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -120,
          left: -80,
          width: 400,
          height: 400,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 4,
          height: H,
          background: "linear-gradient(180deg, #8b5cf6 0%, #3b82f6 50%, transparent 100%)",
        }}
      />

      {/* TOP — avatar + name + url */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <img
          src={AVATAR_URL}
          width={56}
          height={56}
          style={{
            borderRadius: 9999,
            border: "2px solid rgba(255,255,255,0.12)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {SITE_TITLE}
          </span>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>{SITE_URL}</span>
        </div>
      </div>

      {/* MIDDLE — title + optional description */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginTop: 80,
        }}
      >
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: W - 144,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.5,
              maxWidth: W - 144,
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* BOTTOM — site name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            }}
          />
          <span style={{ fontSize: 15, color: "rgba(255,255,255,0.3)" }}>{SITE_TITLE}</span>
        </div>
      </div>
    </div>,
    { width: W, height: H },
  );
}
