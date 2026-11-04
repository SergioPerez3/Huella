export const categories = {
  food: { label: "Alimentación", color: "#25906a" },
  vet: { label: "Veterinario", color: "#2f80c9" },
  medication: { label: "Medicamentos", color: "#d64545" },
  vaccines: { label: "Vacunas y desparasitación", color: "#8e5bd6" },
  grooming: { label: "Peluquería", color: "#e0a526" },
  toys: { label: "Juguetes y accesorios", color: "#f2994a" },
  training: { label: "Adiestramiento", color: "#17a2b8" },
  boarding: { label: "Guardería y residencia", color: "#7a8f3a" },
  other: { label: "Otros", color: "#8a948e" },
};

const money = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export const formatMoney = (cents) => money.format(cents / 100);

export const toCents = (value) =>
  Math.round(Number(String(value).replace(",", ".")) * 100);

export const monthRange = (month) => {
  const [year, mon] = month.split("-").map(Number);
  return {
    from: new Date(Date.UTC(year, mon - 1, 1)).toISOString(),
    to: new Date(Date.UTC(year, mon, 1) - 1).toISOString(),
  };
};
