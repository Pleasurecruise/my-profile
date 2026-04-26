import { z } from "zod";

const optionalNonEmptyString = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .pipe(z.string().optional());

const clientEnvSchema = z.object({
  VITE_MAPBOX_TOKEN: optionalNonEmptyString,
});

const clientEnv = clientEnvSchema.parse(import.meta.env);

export const env = {
  MAPBOX_TOKEN: clientEnv.VITE_MAPBOX_TOKEN ?? null,
} as const;
