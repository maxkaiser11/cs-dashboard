import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const CACHE_DIR = ".cache";
const USE_CACHE = process.env.NODE_ENV !== "production";

type CachedFetchOptions = {
  /** Skip reading the cache and always hit the network (the response is still written to the cache). */
  fresh?: boolean;
};

export async function cachedFetchJson<T>(
  key: string,
  url: URL | string,
  { fresh = false }: CachedFetchOptions = {},
): Promise<T> {
  const file = path.join(CACHE_DIR, `${key}.json`);

  if (USE_CACHE && !fresh) {
    try {
      return JSON.parse(await readFile(file, "utf8")) as T;
    } catch {
      // no cached copy yet, fall through and fetch
    }
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const data = (await res.json()) as T;

  if (USE_CACHE) {
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(file, JSON.stringify(data, null, 2));
  }
  return data;
}
