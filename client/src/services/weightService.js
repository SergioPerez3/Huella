import { request } from "./api.js";

export const getWeights = (petId) => request(`/pets/${petId}/weights`);
