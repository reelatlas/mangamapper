// Polite fetching for scrape sources. One rule: AFL's robots.txt says
// Crawl-delay: 10, so every host gets a 10s floor between requests (AFG gets
// the same courtesy). Conditional GETs make unchanged pages cost the host ~0.

const USER_AGENT = 'mangaMapper/0.1 (ingest; contact: seanreedux@gmail.com)';
const HOST_DELAY_MS = 10_000;

const lastFetchByHost = new Map<string, number>();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface ConditionalMeta {
  etag?: string | null;
  lastModified?: string | null;
}

export interface PoliteResult {
  status: number;         // 200, 304, or error status
  html: string | null;    // null on 304 / error
  etag: string | null;
  lastModified: string | null;
}

export async function politeFetch(url: string, cond: ConditionalMeta = {}): Promise<PoliteResult> {
  const host = new URL(url).host;
  const last = lastFetchByHost.get(host) ?? 0;
  const wait = last + HOST_DELAY_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastFetchByHost.set(host, Date.now());

  const headers: Record<string, string> = { 'User-Agent': USER_AGENT };
  if (cond.etag) headers['If-None-Match'] = cond.etag;
  if (cond.lastModified) headers['If-Modified-Since'] = cond.lastModified;

  const res = await fetch(url, { headers, redirect: 'follow' });
  return {
    status: res.status,
    html: res.status === 200 ? await res.text() : null,
    etag: res.headers.get('etag'),
    lastModified: res.headers.get('last-modified'),
  };
}
