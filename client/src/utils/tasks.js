export const taskTypes = {
  walk: { label: 'Paseo', color: '#25906a' },
  feeding: { label: 'Alimentación', color: '#2f80c9' },
  medication: { label: 'Medicación', color: '#d64545' },
  grooming: { label: 'Peluquería', color: '#8e5bd6' },
  vet: { label: 'Veterinario', color: '#f2994a' },
  training: { label: 'Adiestramiento', color: '#17a2b8' },
  other: { label: 'Otra', color: '#8a948e' },
};

export const recurrenceLabels = {
  none: 'No se repite',
  daily: 'Cada día',
  weekly: 'Cada semana',
  monthly: 'Cada mes',
};

const pad = (n) => String(n).padStart(2, '0');

export const localDateKey = (value) => {
  const d = new Date(value);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const toLocalInput = (value) => {
  const d = new Date(value);
  return `${localDateKey(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const fromLocalInput = (value) => new Date(value).toISOString();
export const endOfDay = (dateStr) => new Date(`${dateStr}T23:59`).toISOString();

export const formatTime = (value) =>
  new Date(value).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

export const formatDateTime = (value) =>
  new Date(value).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export const formatLongDate = (key) =>
  new Date(`${key}T12:00`).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });