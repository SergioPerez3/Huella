import { geocode } from "../services/geocodeService.js";
import { findPlaces, CATEGORY_KEYS } from "../services/placesService.js";

const MADRID = { lat: 40.4168, lng: -3.7038, name: "Madrid" };
const sendError = (res, status, message) =>
  res.status(status).json({ error: { message } });

export const searchServices = async (req, res, next) => {
  try {
    const { q, lat, lng, category = "todos" } = req.query;

    if (category !== "todos" && !CATEGORY_KEYS.includes(category)) {
      return sendError(res, 400, "Categoría no válida");
    }
    const radiusKm = Math.min(50, Math.max(5, Number(req.query.radius) || 30));

    let origin = MADRID;
    if (typeof q === "string" && q.trim()) {
      if (q.trim().length > 100)
        return sendError(res, 400, "La búsqueda es demasiado larga");
      origin = await geocode(q);
      if (!origin)
        return sendError(
          res,
          404,
          "No encontramos ese lugar. Prueba con otra ciudad o código postal.",
        );
    } else if (lat !== undefined && lng !== undefined) {
      const latitude = Number(lat);
      const longitude = Number(lng);
      const valid =
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        Math.abs(latitude) <= 90 &&
        Math.abs(longitude) <= 180;
      if (!valid) return sendError(res, 400, "Ubicación no válida");
      origin = { lat: latitude, lng: longitude, name: "Tu ubicación" };
    }

    const { places, counts, total } = await findPlaces(origin, radiusKm);
    const list =
      category === "todos"
        ? places
        : places.filter((p) => p.category === category);

    res.json({ data: { origin, radiusKm, counts, total, places: list } });
  } catch (err) {
    if (err.status) return sendError(res, err.status, err.message);
    next(err);
  }
};
