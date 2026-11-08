import { request } from "./api.js";

export const searchServices = ({ q, lat, lng, radius } = {}) => {
  const params = new URLSearchParams();
  if (q) {
    params.set("q", q);
  } else if (lat != null && lng != null) {
    params.set("lat", lat);
    params.set("lng", lng);
  }
  if (radius) params.set("radius", radius);
  return request(`/services?${params}`);
};
