const CACHE_TTL = 30 * 60 * 1000;
const API = 'https://api.github.com';

function cacheKey(url) { return 'gh_cache_' + url; }

async function cachedFetch(url) {
  const key = cacheKey(url);
  const cached = localStorage.getItem(key);
  if (cached) {
    const { data, ts } = JSON.parse(cached);
    if (Date.now() - ts < CACHE_TTL) return { data, fromCache: true };
  }
  const resp = await fetch(url);
  if (!resp.ok) {
    const remaining = resp.headers.get('X-RateLimit-Remaining');
    if (resp.status === 403 && remaining === '0') {
      const reset = resp.headers.get('X-RateLimit-Reset');
      throw new Error(`Rate limited. Resets at ${new Date(reset * 1000).toLocaleTimeString()}`);
    }
    throw new Error(`HTTP ${resp.status} for ${url}`);
  }
  const data = await resp.json();
  const remaining = resp.headers.get('X-RateLimit-Remaining');
  const limit = resp.headers.get('X-RateLimit-Limit');
  localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  return { data, fromCache: false, remaining, limit };
}

function clearCache() {
  Object.keys(localStorage).filter(k => k.startsWith('gh_cache_'))
    .forEach(k => localStorage.removeItem(k));
}

async function loadReposConfig() {
  const override = localStorage.getItem('repos_override');
  if (override) return JSON.parse(override);
  const resp = await fetch('repos.json');
  return resp.json();
}
