import {
  FiHome,
  FiHeart,
  FiCalendar,
  FiCheckSquare,
  FiActivity,
  FiDollarSign,
  FiSettings,
} from "react-icons/fi";

export const mainNav = [
  { to: "/dashboard", label: "Inicio", short: "Inicio", Icon: FiHome },
  { to: "/pets", label: "Mis mascotas", short: "Mascotas", Icon: FiHeart },
  {
    to: "/calendar",
    label: "Calendario",
    short: "Calendario",
    Icon: FiCalendar,
  },
  { to: "/tasks", label: "Tareas", short: "Tareas", Icon: FiCheckSquare },
  {
    to: "/health",
    label: "Salud",
    short: "Salud",
    Icon: FiActivity,
    mobile: true,
  },

  { to: "/expenses", label: "Gastos", short: "Gastos", Icon: FiDollarSign },
];

export const settingsNav = {
  to: "/settings",
  label: "Configuración",
  Icon: FiSettings,
};
