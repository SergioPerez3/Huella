import { request } from "./api.js";

export const getDocuments = (petId) => request(`/pets/${petId}/documents`);

export const uploadDocument = (petId, formData) =>
  request(`/pets/${petId}/documents`, { method: "POST", body: formData });

export const deleteDocument = (petId, id) =>
  request(`/pets/${petId}/documents/${id}`, { method: "DELETE" });
