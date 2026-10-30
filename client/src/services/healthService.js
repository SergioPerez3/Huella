import { request } from "./api.js";

export const getHealthRecords = (petId, { type, limit = 100 } = {}) => {
  const params = new URLSearchParams({ limit });
  if (type) params.set("type", type);
  return request(`/pets/${petId}/health?${params}`);
};

export const createHealthRecord = (petId, data) =>
  request(`/pets/${petId}/health`, { method: "POST", body: data });

export const updateHealthRecord = (petId, id, data) =>
  request(`/pets/${petId}/health/${id}`, { method: "PATCH", body: data });

export const deleteHealthRecord = (petId, id) =>
  request(`/pets/${petId}/health/${id}`, { method: "DELETE" });
