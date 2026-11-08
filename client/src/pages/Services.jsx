import { useState, useEffect } from "react";
import { FiMapPin, FiSearch, FiCrosshair, FiAlertCircle } from "react-icons/fi";
import PageHeader from "../components/PageHeader.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import { searchServices } from "../services/servicesService.js";

const STORAGE_KEY = "huella:services:place";
const PAGE_SIZE = 12;
const RADIUS_OPTIONS = [10, 30, 50];

const categories = [
  { key: "todos", label: "Todos" },
  { key: "veterinarios", label: "Veterinarios" },
  { key: "peluquerias", label: "Peluquerías" },
  { key: "residencias", label: "Residencias" },
  { key: "tiendas", label: "Tiendas" },
  { key: "cuidadores", label: "Cuidadores" },
  { key: "paseadores", label: "Paseadores" },
  { key: "adiestradores", label: "Adiestradores" },
];

const readPlace = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Si es una ubicación por GPS se guarda redondeada (~1 km)
const savePlace = (place) => {
  try {
    if (!place) return localStorage.removeItem(STORAGE_KEY);
    const stored =
      place.lat != null
        ? {
            lat: Math.round(place.lat * 100) / 100,
            lng: Math.round(place.lng * 100) / 100,
          }
        : place;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
};

const Services = () => {
  const [place, setPlace] = useState(readPlace); // null = Madrid
  const [input, setInput] = useState(() => readPlace()?.q || "");
  const [radius, setRadius] = useState(30);
  const [category, setCategory] = useState("todos");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    searchServices({ ...place, radius })
      .then((res) => {
        if (ignore) return;
        setData(res.data);
        setVisible(PAGE_SIZE);
        savePlace(place);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [place, radius, attempt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    setPlace(text ? { q: text } : null);
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      return setError("Tu navegador no permite obtener la ubicación.");
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setInput("");
        setPlace({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocating(false);
        setError("No pudimos obtener tu ubicación. Busca tu ciudad a mano.");
      },
      { timeout: 10000 },
    );
  };

  const list = data
    ? category === "todos"
      ? data.places
      : data.places.filter((p) => p.category === category)
    : [];
  const shown = list.slice(0, visible);
  const countOf = (key) => (key === "todos" ? data?.total : data?.counts[key]);

  return (
    <section>
      <PageHeader
        icon={FiMapPin}
        title="Servicios"
        subtitle="Encuentra lo que tu mascota necesita, cerca de ti"
      />

      <div className="svc-hero">
        <div className="svc-hero-main">
          <h2>Veterinarios, peluquerías y mucho más</h2>
          <p>
            {data
              ? `Mostrando resultados cerca de ${data.origin.name}`
              : "Buscando servicios cerca de ti…"}
          </p>

          <form className="svc-search" onSubmit={handleSubmit}>
            <label className="svc-input">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ciudad o código postal (por defecto, Madrid)"
                maxLength={100}
                aria-label="Ciudad o código postal"
              />
            </label>
            <select
              className="svc-radius"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              aria-label="Radio de búsqueda"
            >
              {RADIUS_OPTIONS.map((km) => (
                <option key={km} value={km}>
                  {km} km
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-light">
              Buscar
            </button>
            <button
              type="button"
              className="btn svc-locate"
              onClick={handleLocate}
              disabled={locating}
            >
              <FiCrosshair aria-hidden="true" />{" "}
              {locating ? "Localizando…" : "Usar mi ubicación"}
            </button>
          </form>
        </div>

        <div className="svc-stat" aria-live="polite">
          {loading ? (
            <span className="spinner" role="status" aria-label="Cargando" />
          ) : (
            <>
              <b>{data?.total ?? 0}</b>
              <span>servicios</span>
            </>
          )}
        </div>
      </div>

      {error && (
        <div role="alert" className="svc-error">
          <FiAlertCircle aria-hidden="true" /> <span>{error}</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setAttempt((n) => n + 1)}
          >
            Reintentar
          </button>
        </div>
      )}

      {loading && (
        <div className="svc-loading" role="status">
          <span className="spinner dark" aria-hidden="true" />
          <span>
            Buscando servicios cerca de{" "}
            {place?.q || (place ? "tu ubicación" : "Madrid")}…
          </span>
        </div>
      )}

      <div className="svc-pills" role="tablist" aria-label="Categorías">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={category === key}
            className={`svc-pill ${category === key ? "is-active" : ""}`}
            onClick={() => {
              setCategory(key);
              setVisible(PAGE_SIZE);
            }}
          >
            {label}
            {data && <span className="svc-count">{countOf(key)}</span>}
          </button>
        ))}
      </div>

      {loading && !data ? (
        <div className="svc-grid" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="svc-card svc-skeleton">
              <span className="spinner dark" />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`svc-grid ${loading ? "is-loading" : ""}`}
          aria-busy={loading}
        >
          {shown.map((p) => (
            <ServiceCard key={p.id} place={p} />
          ))}
        </div>
      )}

      {!loading && data && list.length === 0 && (
        <div className="card svc-empty">
          <FiMapPin aria-hidden="true" size={28} />
          <p>
            No hemos encontrado resultados en esta categoría a {radius} km.
            Prueba con otro radio o con otra ciudad.
          </p>
        </div>
      )}

      {list.length > shown.length && (
        <div className="svc-more">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Ver más ({list.length - shown.length})
          </button>
        </div>
      )}

      <p className="svc-attrib">
        Datos de{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
        >
          © colaboradores de OpenStreetMap
        </a>
        . Pueden estar incompletos o desactualizados. Las tarjetas marcadas como
        “Ejemplo” son de demostración.
      </p>
    </section>
  );
};

export default Services;
