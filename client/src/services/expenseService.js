import { request } from "./api.js";

export const getExpenses = (params) =>
  request(`/expenses?${new URLSearchParams(params)}`);
export const getExpenseSummary = (params) =>
  request(`/expenses/summary?${new URLSearchParams(params)}`);
export const createExpense = (data) =>
  request("/expenses", { method: "POST", body: data });
export const updateExpense = (id, data) =>
  request(`/expenses/${id}`, { method: "PATCH", body: data });
export const deleteExpense = (id) =>
  request(`/expenses/${id}`, { method: "DELETE" });
