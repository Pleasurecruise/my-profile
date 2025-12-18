import OSS from "ali-oss";

let cachedBaseConfig: OSS.Options | null = null;

function resolveBaseConfig() {
  if (cachedBaseConfig) {
    return cachedBaseConfig;
  }

  const baseConfig: OSS.Options = {
    region: process.env.ALI_OSS_REGION!,
    bucket: process.env.ALI_OSS_BUCKET!,
    accessKeyId: process.env.ALI_OSS_ACCESS_KEY_ID!,
    accessKeySecret: process.env.ALI_OSS_ACCESS_KEY_SECRET!,
  };

  cachedBaseConfig = baseConfig;
  return cachedBaseConfig;
}

const globalForOSS = globalThis as unknown as {
  __ALI_OSS_CLIENT__?: OSS;
};

export function getAliOssClient() {
  if (!globalForOSS.__ALI_OSS_CLIENT__) {
    globalForOSS.__ALI_OSS_CLIENT__ = new OSS(resolveBaseConfig());
  }
  return globalForOSS.__ALI_OSS_CLIENT__;
}
