import {
  FiHome,
  FiHeart,
  FiCalendar,
  FiCheckSquare,
  FiActivity,
  FiDollarSign,
  FiSettings,
  FiMapPin,
} from "react-icons/fi";

export const mainNav = [
  {
    to: "/dashboard",
    label: "Inicio",
    short: "Inicio",
    Icon: FiHome,
    mobile: true,
  },
  {
    to: "/pets",
    label: "Mis mascotas",
    short: "Mascotas",
    Icon: FiHeart,
    mobile: true,
  },
  {
    to: "/calendar",
    label: "Calendario",
    short: "Calendario",
    Icon: FiCalendar,
    mobile: true,
  },
  {
    to: "/tasks",
    label: "Tareas",
    short: "Tareas",
    Icon: FiCheckSquare,
    mobile: true,
  },
  { to: "/health", label: "Salud", short: "Salud", Icon: FiActivity },
  { to: "/expenses", label: "Gastos", short: "Gastos", Icon: FiDollarSign },
  { to: "/services", label: "Servicios", Icon: FiMapPin },
];

export const settingsNav = {
  to: "/settings",
  label: "Configuración",
  Icon: FiSettings,
};
