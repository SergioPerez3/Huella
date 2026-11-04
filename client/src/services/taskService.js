import { request } from "./api.js";

export const getTasks = (params) =>
  request(`/tasks?${new URLSearchParams(params)}`);
export const createTask = (data) =>
  request("/tasks", { method: "POST", body: data });
export const updateTask = (id, data) =>
  request(`/tasks/${id}`, { method: "PATCH", body: data });
export const deleteTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });
export const completeTask = (id) =>
  request(`/tasks/${id}/complete`, { method: "POST" });
export const skipTask = (id) =>
  request(`/tasks/${id}/skip`, { method: "POST" });
