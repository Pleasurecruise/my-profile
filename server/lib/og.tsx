import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";

const SITE_TITLE = "Pleasure1234";
const SITE_DESCRIPTION = "Full-stack Developer · Any shortcomings are kindly overlooked. 🙏";
const SITE_URL = "you-find.me";
const AVATAR_URL = "https://avatars.githubusercontent.com/u/144885467?v=4";
const W = 1200;
const H = 630;

const palette = {
  background: "#ffffff",
  card: "#ffffff",
  mutedSurface: "#f5f5f5",
  border: "#e5e5e5",
  mutedForeground: "#737373",
  foreground: "#08090a",
  primary: "#171717",
  primaryForeground: "#fafafa",
} as const;

const FONT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_4; en-us) AppleWebKit/533.18.1 (KHTML, like Gecko) Version/5.0.2 Safari/533.18.5";
const FONT_BASELINE =
  " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:;!?/#&@()[]-—…'\"·";

type FontWeight = 400 | 500 | 600;
type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: "normal";
};

const fontCache = new Map<string, Promise<OgFont>>();

async function loadFont(family: string, weight: FontWeight, text: string): Promise<OgFont> {
  const chars = Array.from(new Set(FONT_BASELINE + text))
    .sort()
    .join("");
  const key = `${family}:${weight}:${chars}`;
  const cached = fontCache.get(key);
  if (cached) return cached;

  const request = (async () => {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(chars)}`;
    const cssResponse = await fetch(cssUrl, { headers: { "User-Agent": FONT_USER_AGENT } });
    if (!cssResponse.ok) {
      throw new Error(`Failed to load ${family} ${weight} CSS: ${cssResponse.status}`);
    }
    const css = await cssResponse.text();
    const fontUrl = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
    if (!fontUrl) throw new Error(`Font URL missing for ${family} ${weight}`);

    const fontResponse = await fetch(fontUrl);
    if (!fontResponse.ok) {
      throw new Error(`Failed to load ${family} ${weight} font: ${fontResponse.status}`);
    }

    return {
      name: family,
      data: await fontResponse.arrayBuffer(),
      weight,
      style: "normal" as const,
    };
  })();

  fontCache.set(key, request);
  return request;
}

export async function generateOgImageResponse(): Promise<Response> {
  const fontText = `${SITE_TITLE}${SITE_DESCRIPTION}${SITE_URL}PERSONAL SITE PROFILE ONLINE Full-stack developer Making useful things with code, care, and a little curiosity. CODE OPEN SOURCE SOCIAL`;
  const fonts = await Promise.all([
    loadFont("Inter", 400, fontText),
    loadFont("Inter", 600, fontText),
    loadFont("Fira Code", 500, fontText),
  ]);

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: W,
        height: H,
        display: "flex",
        background: palette.background,
        color: palette.foreground,
        fontFamily: "Inter",
        overflow: "hidden",
      }}
    >
      {/* A recessed neutral rail gives the profile card structure without decorative color. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 395,
          height: H,
          display: "flex",
          background: palette.mutedSurface,
          borderLeft: `1px solid ${palette.border}`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 805,
          height: H,
          padding: "58px 0 43px 68px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 680,
            display: "flex",
            alignItems: "center",
            paddingBottom: 25,
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              display: "flex",
              borderRadius: 9999,
              background: palette.primary,
              marginRight: 15,
            }}
          />
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "0.04em" }}>
            {SITE_TITLE.toUpperCase()}
          </span>
          <span
            style={{
              marginLeft: "auto",
              color: palette.mutedForeground,
              fontFamily: "Fira Code",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            PERSONAL SITE · PROFILE
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            alignSelf: "flex-start",
            height: 36,
            marginTop: 42,
            padding: "0 17px",
            borderRadius: 10,
            background: palette.primary,
            color: palette.primaryForeground,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          FULL-STACK DEVELOPER
        </div>

        <div
          style={{
            width: 680,
            maxHeight: 225,
            display: "flex",
            alignItems: "center",
            marginTop: 25,
            overflow: "hidden",
            fontSize: 84,
            fontWeight: 600,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          {SITE_TITLE}
        </div>

        <div
          style={{
            width: 675,
            maxHeight: 64,
            display: "flex",
            marginTop: 17,
            overflow: "hidden",
            color: palette.mutedForeground,
            fontSize: 19,
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          {SITE_DESCRIPTION}
        </div>

        <div
          style={{
            width: 680,
            display: "flex",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: 24,
            borderTop: `1px solid ${palette.border}`,
            color: palette.mutedForeground,
            fontFamily: "Fira Code",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          <span>{SITE_URL}</span>
          <span style={{ marginLeft: "auto" }}>CODE · OPEN SOURCE · SOCIAL</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 57,
          right: 34,
          width: 327,
          height: 516,
          display: "flex",
          flexDirection: "column",
          padding: "28px 27px 22px",
          border: `1px solid ${palette.border}`,
          borderRadius: 18,
          background: palette.card,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 273,
            height: 314,
            display: "flex",
            overflow: "hidden",
            borderRadius: 14,
            background: palette.mutedSurface,
          }}
        >
          <img
            src={AVATAR_URL}
            alt=""
            width={273}
            height={314}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              display: "flex",
              padding: "7px 10px",
              borderRadius: 10,
              background: palette.primary,
              color: palette.primaryForeground,
              fontFamily: "Fira Code",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            ONLINE
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
          <div
            style={{
              width: 8,
              height: 8,
              display: "flex",
              marginRight: 10,
              borderRadius: 9999,
              background: palette.primary,
            }}
          />
          <span style={{ fontSize: 15, fontWeight: 600 }}>Full-stack developer</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 17,
            color: palette.mutedForeground,
            fontSize: 13,
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          <span>Making useful things with code,</span>
          <span>care, and a little curiosity.</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "auto",
            paddingTop: 13,
            borderTop: `1px solid ${palette.border}`,
            color: palette.mutedForeground,
            fontFamily: "Fira Code",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          PLEASURE1234
        </div>
      </div>
    </div>,
    {
      width: W,
      height: H,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    },
  );
}
