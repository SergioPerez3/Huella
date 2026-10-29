const API_URL = import.meta.env.VITE_API_URL;

export const handleResponse = async (response) => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error?.message || "Something went wrong");
    error.status = response.status;
    throw error;
  }
  return body;
};

export const request = (path, { method = "GET", body } = {}) =>
  fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  }).then(handleResponse);
