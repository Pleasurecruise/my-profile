import type { Bindings } from "../types/bindings";
import type { KvConfigKey, SecretBackedValue } from "../types/config";

export async function getConfig(env: Bindings, key: KvConfigKey): Promise<string> {
  const value = normalizeValue((await env.KV_NAMESPACE.get(key)) ?? env[key]);
  if (!value) {
    throw new Error(`Missing config: ${key}`);
  }
  return value;
}

export async function getSecret(value: SecretBackedValue, name: string): Promise<string> {
  const resolvedValue = normalizeValue(
    typeof value === "string" ? value : value ? await value.get() : undefined,
  );
  if (!resolvedValue) {
    throw new Error(`Missing secret: ${name}`);
  }
  return resolvedValue;
}

function normalizeValue(value: string | undefined): string | undefined {
  return value?.trim() || undefined;
}
