import { request } from "./api.js";

export const registerUser = (data) =>
  request("/auth/register", { method: "POST", body: data });

export const loginUser = (data) =>
  request("/auth/login", { method: "POST", body: data });

export const startDemo = () => request("/auth/demo", { method: "POST" });

export const logoutUser = () => request("/auth/logout", { method: "POST" });

export const getMe = () => request("/auth/me");

export const updateMe = (data) =>
  request("/auth/me", { method: "PATCH", body: data });
export const deleteMe = (password) =>
  request("/auth/me", { method: "DELETE", body: { password } });

export const uploadUserAvatar = (formData) =>
  request("/auth/me/avatar", { method: "POST", body: formData });
export const deleteUserAvatar = () =>
  request("/auth/me/avatar", { method: "DELETE" });
