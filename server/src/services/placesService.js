import { SERVICE_EXAMPLES } from "../data/communityServices.js";

const OVERPASS_URLS = (
  process.env.OVERPASS_URLS ||
  [
    "https://ovp.dresel.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass-api.de/api/interpreter",
  ].join(",")
)
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);
const USER_AGENT =
  process.env.GEO_USER_AGENT ||
  "Huella/1.0 (+https://github.com/SergioPerez3/Huella)";
const TTL = 60 * 60 * 1000;
const MAX_CACHE = 200;
const MAX_RESULTS = 300;

const cache = new Map();

const LABELS = {
  veterinarios: "Veterinario",
  peluquerias: "Peluquería",
  residencias: "Residencia",
  tiendas: "Tienda",
  adiestradores: "Adiestrador",
  cuidadores: "Cuidador",
  paseadores: "Paseador",
};
export const CATEGORY_KEYS = Object.keys(LABELS);

const OSM_FILTERS = [
  '["amenity"="veterinary"]',
  '["shop"="pet_grooming"]',
  '["amenity"="animal_boarding"]',
  '["shop"="pet"]',
  '["amenity"="animal_training"]',
];

const categoryOf = (tags) => {
  if (tags.amenity === "veterinary") return "veterinarios";
  if (tags.shop === "pet_grooming") return "peluquerias";
  if (tags.amenity === "animal_boarding") return "residencias";
  if (tags.shop === "pet") return "tiendas";
  if (tags.amenity === "animal_training") return "adiestradores";
  return null;
};

const httpError = (status, message) =>
  Object.assign(new Error(message), { status });
const round = (value, decimals) =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;

export const haversineKm = (a, b) => {
  const rad = (deg) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};

const safeUrl = (value) => {
  if (!value) return null;
  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    );
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

export const normalize = (element, origin) => {
  const tags = element.tags || {};
  const category = categoryOf(tags);
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;
  if (!category || !tags.name || lat == null || lng == null) return null;

  const street = [tags["addr:street"], tags["addr:housenumber"]]
    .filter(Boolean)
    .join(" ");
  const address = [street, tags["addr:postcode"], tags["addr:city"]]
    .filter(Boolean)
    .join(", ");
  const phone = (tags.phone || tags["contact:phone"] || "")
    .split(";")[0]
    .trim();

  return {
    id: `osm-${element.type}-${element.id}`,
    name: tags.name,
    category,
    label: LABELS[category],
    address: address || null,
    phone: phone || null,
    website: safeUrl(tags.website || tags["contact:website"]),
    hours: tags.opening_hours || null,
    lat,
    lng,
    distanceKm: round(haversineKm(origin, { lat, lng }), 1),
    source: "osm",
  };
};

const OVERPASS_ERROR =
  "El servicio de mapas no responde ahora mismo. Inténtalo en unos minutos.";

// Rectángulo que contiene el círculo de búsqueda: Overpass lo resuelve mucho más rápido que "around"
const bbox = (center, radiusKm) => {
  const dLat = radiusKm / 111.32;
  const dLng = radiusKm / (111.32 * Math.cos((center.lat * Math.PI) / 180));
  return [
    center.lat - dLat,
    center.lng - dLng,
    center.lat + dLat,
    center.lng + dLng,
  ]
    .map((v) => v.toFixed(4))
    .join(",");
};

const fetchOsm = async (center, radiusKm) => {
  const box = bbox(center, radiusKm);
  const query = `[out:json][timeout:15][maxsize:16777216];(${OSM_FILTERS.map((f) => `nwr${f}(${box});`).join("")});out center tags 600;`;
  for (const url of OVERPASS_URLS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "User-Agent": USER_AGENT },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        console.error(`[services] Overpass ${url} respondió ${res.status}`);
        continue;
      }
      const json = await res.json();
      return json.elements || [];
    } catch (err) {
      console.error(`[services] Overpass ${url} falló: ${err.message}`);
    }
  }
  throw httpError(502, OVERPASS_ERROR);
};

const inflight = new Map();

const getElements = async (center, radiusKm) => {
  const key = `${center.lat},${center.lng}:${radiusKm}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.value;
  if (inflight.has(key)) return inflight.get(key);

  const pending = fetchOsm(center, radiusKm)
    .then((elements) => {
      if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value);
      cache.set(key, { at: Date.now(), value: elements });
      return elements;
    })
    .catch((err) => {
      if (hit) return hit.value; // datos antiguos mejor que nada
      throw err;
    })
    .finally(() => inflight.delete(key));

  inflight.set(key, pending);
  return pending;
};

export const findPlaces = async (origin, radiusKm) => {
  // Consultamos con coordenadas redondeadas (~1 km): mejor caché y menos precisión de la necesaria.
  const center = { lat: round(origin.lat, 2), lng: round(origin.lng, 2) };
  const elements = await getElements(center, radiusKm);

  const fromOsm = elements.map((el) => normalize(el, origin)).filter(Boolean);
  const examples = SERVICE_EXAMPLES.map((s) => ({
    ...s,
    distanceKm: round(haversineKm(origin, s), 1),
  })).filter((s) => s.distanceKm <= radiusKm);

  const all = [...fromOsm, ...examples]
    .filter((p) => p.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const counts = Object.fromEntries(CATEGORY_KEYS.map((k) => [k, 0]));
  all.forEach((p) => (counts[p.category] += 1));

  return { places: all.slice(0, MAX_RESULTS), counts, total: all.length };
};
