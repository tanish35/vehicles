import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

export function getValue(key: string): Promise<string | null> {
  return redis.get(key);
}

export function setValue(
  key: string,
  value: any,
  expirationInSeconds: number = 300,
): Promise<string | null> {
  return redis.set(key, value, { ex: expirationInSeconds });
}

export function deleteValue(key: string): Promise<number> {
  return redis.del(key);
}

export default redis;
