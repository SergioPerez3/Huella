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

export const request = (path, { method = "GET", body } = {}) => {
  const isForm = body instanceof FormData;
  return fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers:
      body && !isForm ? { "Content-Type": "application/json" } : undefined,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  }).then(handleResponse);
};
