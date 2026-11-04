import { request } from "./api.js";

export const getWeights = (petId) => request(`/pets/${petId}/weights`);
export const createWeight = (petId, data) =>
  request(`/pets/${petId}/weights`, { method: "POST", body: data });
export const updateWeight = (petId, id, data) =>
  request(`/pets/${petId}/weights/${id}`, { method: "PATCH", body: data });
export const deleteWeight = (petId, id) =>
  request(`/pets/${petId}/weights/${id}`, { method: "DELETE" });
