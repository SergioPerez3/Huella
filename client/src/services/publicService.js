import { request } from "./api.js";

export const getEmergencyCard = (token) =>
  request(`/public/emergency/${token}`);
