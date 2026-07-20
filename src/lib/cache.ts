// Redis cache layer — reduces blockchain API calls

let redis: any = null;

async function getClient() {
  if (redis) return redis;
  try {
    const { createClient } = await import('redis');
    const { config } = await import('./config');
    if (!config.redis.enabled) return null;
    redis = createClient({ url: config.redis.url });
    await redis.connect();
    console.log('Redis connected');
  } catch { /* Redis optional */ }
  return redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = await getClient();
  if (!client) return null;
  const val = await client.get('megapay:' + key);
  return val ? JSON.parse(val) : null;
}

export async function cacheSet(key: string, val: any, ttl = 30): Promise<void> {
  const client = await getClient();
  if (!client) return;
  await client.setEx('megapay:' + key, ttl, JSON.stringify(val));
}
