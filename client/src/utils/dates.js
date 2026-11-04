import { localDateKey } from "./tasks.js";

const DAY = 24 * 60 * 60 * 1000;

// Compares calendar days (not hours) so the result does not depend on the timezone
export const dayDiff = (value) =>
  (Date.parse(String(value).slice(0, 10)) -
    Date.parse(localDateKey(new Date()))) /
  DAY;

export const dueText = (days) => {
  if (days === 0) return "Hoy";
  if (days === 1) return "Mañana";
  return `En ${days} días`;
};
