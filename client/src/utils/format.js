export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

export const toDateInput = (value) => (value ? value.slice(0, 10) : "");
