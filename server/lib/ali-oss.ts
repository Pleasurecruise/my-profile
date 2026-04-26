import OSS from "ali-oss";
import { env } from "./env";

const globalForOSS = globalThis as unknown as { __ALI_OSS_CLIENT__?: OSS };

export function getAliOssClient() {
  if (!globalForOSS.__ALI_OSS_CLIENT__) {
    globalForOSS.__ALI_OSS_CLIENT__ = new OSS({
      region: env.ALI_OSS_REGION,
      bucket: env.ALI_OSS_BUCKET,
      accessKeyId: env.ALI_OSS_ACCESS_KEY_ID,
      accessKeySecret: env.ALI_OSS_ACCESS_KEY_SECRET,
    });
  }
  return globalForOSS.__ALI_OSS_CLIENT__;
}
