import { request } from "./api.js";

export const getPets = () => request("/pets");
export const getPet = (id) => request(`/pets/${id}`);
export const createPet = (data) =>
  request("/pets", { method: "POST", body: data });
export const updatePet = (id, data) =>
  request(`/pets/${id}`, { method: "PATCH", body: data });
export const deletePet = (id) => request(`/pets/${id}`, { method: "DELETE" });
export const uploadPetPhoto = (id, formData) =>
  request(`/pets/${id}/photo`, { method: "POST", body: formData });
