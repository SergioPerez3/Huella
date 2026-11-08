const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT =
  process.env.GEO_USER_AGENT ||
  "Huella/1.0 (+https://github.com/SergioPerez3/Huella)";
const TTL = 24 * 60 * 60 * 1000;
const MAX_CACHE = 500;

const cache = new Map();
let nextSlot = 0;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const httpError = (status, message) =>
  Object.assign(new Error(message), { status });

export const geocode = async (query) => {
  const key = query.trim().toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.value;

  const delay = Math.max(0, nextSlot - Date.now());
  nextSlot = Date.now() + delay + 1100;
  if (delay) await wait(delay);

  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "1",
    countrycodes: "es",
  });

  let results;
  try {
    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { "User-Agent": USER_AGENT, "Accept-Language": "es" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Nominatim ${res.status}`);
    results = await res.json();
  } catch {
    throw httpError(
      502,
      "No se pudo buscar ese lugar ahora mismo. Inténtalo en unos minutos.",
    );
  }

  const first = results[0];
  if (!first) return null;

  const value = {
    lat: Number(first.lat),
    lng: Number(first.lon),
    name: first.display_name
      .split(",")
      .slice(0, 2)
      .map((s) => s.trim())
      .join(", "),
  };
  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value);
  cache.set(key, { at: Date.now(), value });
  return value;
};
