import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Pet from "../models/Pet.js";
import Task from "../models/Task.js";
import Expense from "../models/Expense.js";
import HealthRecord from "../models/HealthRecord.js";
import Weight from "../models/Weight.js";
import { deleteAccountData } from "./accountService.js";

const DEMO_TTL_MS = 24 * 60 * 60 * 1000;

// Fecha relativa a hoy: offset en días y hora UTC
const at = (offsetDays, hour = 8, minute = 0) => {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + offsetDays,
      hour,
      minute,
    ),
  );
};

const newToken = () => crypto.randomBytes(24).toString("base64url");

// Borra las cuentas demo caducadas (y todos sus datos)
export const cleanupExpiredDemos = async () => {
  const expired = await User.find({
    isDemo: true,
    demoExpiresAt: { $lt: new Date() },
  })
    .select("_id")
    .limit(10);
  await Promise.allSettled(expired.map((u) => deleteAccountData(u._id)));
};

export const createDemoAccount = async () => {
  await cleanupExpiredDemos().catch(() => {});

  const password = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);
  const user = await User.create({
    name: "Usuario demo",
    email: `demo-${crypto.randomBytes(6).toString("hex")}@huella.demo`,
    password,
    avatar: { preset: "p1" },
    isDemo: true,
    demoExpiresAt: new Date(Date.now() + DEMO_TTL_MS),
  });
  const owner = user._id;

  const [roco, mof] = await Pet.create([
    {
      owner,
      name: "Roco",
      species: "dog",
      breed: "Braco alemán",
      sex: "male",
      birthDate: at(-365 * 3 - 40),
      microchip: "941000012345678",
      photo: { url: "/landing/hero-dog.jpg" },
      feeding: { food: "Pienso adulto", amount: "320 g/día", schedule: "8:00 y 19:00" },
      allergies: ["Pollo"],
      notes: "Muy sociable. Le encanta el agua y las pelotas.",
      emergency: {
        enabled: true,
        publicToken: newToken(),
        ownerName: "Usuario demo",
        ownerPhone: "+34 600 000 000",
        vetContact: "Clínica Veterinaria Demo · 910 000 000",
        instructions: "Es cariñoso, pero se asusta con los ruidos fuertes.",
        showAllergies: true,
        showMedication: false,
        showConditions: false,
      },
    },
    {
      owner,
      name: "Mof",
      species: "cat",
      breed: "Europeo atigrado naranja",
      sex: "female",
      birthDate: at(-365 * 2 - 120),
      microchip: "941000098765432",
      photo: { url: "/landing/hero-cat.jpg" },
      feeding: { food: "Pienso y comida húmeda", amount: "60 g/día", schedule: "Mañana y noche" },
      notes: "Duerme al sol. Solo come pienso de pescado.",
    },
  ]);

  const task = (pet, title, type, days, hour, extra = {}) => ({
    owner,
    petId: pet._id,
    title,
    type,
    dueAt: at(days, hour),
    status: days < 0 ? "done" : "pending",
    ...(days < 0 ? { completedAt: at(days, hour + 1) } : {}),
    ...extra,
  });

  await Task.create([
    task(roco, "Paseo largo por el parque", "walk", -6, 17),
    task(roco, "Paseo de la mañana", "walk", -2, 8),
    task(roco, "Paseo de la mañana", "walk", 0, 8),
    task(roco, "Paseo de la tarde", "walk", 0, 18),
    task(roco, "Paseo por el río", "walk", 3, 17),
    task(roco, "Peluquería canina", "grooming", 6, 10),
    task(roco, "Clase de adiestramiento", "training", 9, 16),
    task(roco, "Pastilla antiparasitaria", "medication", 14, 9),
    task(mof, "Comida húmeda", "feeding", 0, 19),
    task(mof, "Cepillado", "grooming", 2, 20),
    task(mof, "Vacuna de la leucemia", "vet", 12, 11),
    task(mof, "Revisión dental", "vet", 24, 10),
    task(mof, "Limpiar el arenero a fondo", "other", -4, 10),
  ]);

  await HealthRecord.create([
    { owner, petId: roco._id, type: "vaccine", date: at(-200), title: "Vacuna de la rabia", nextDueDate: at(165), notes: "Sin reacciones." },
    { owner, petId: roco._id, type: "deworming", date: at(-40), title: "Desparasitación interna", nextDueDate: at(50) },
    { owner, petId: roco._id, type: "visit", date: at(-90), title: "Revisión anual", notes: "Todo correcto. Peso adecuado." },
    { owner, petId: mof._id, type: "vaccine", date: at(-150), title: "Trivalente felina", nextDueDate: at(215) },
    { owner, petId: mof._id, type: "vaccine", date: at(-350), title: "Leucemia felina", nextDueDate: at(12) },
    { owner, petId: mof._id, type: "deworming", date: at(-20), title: "Pipeta antiparasitaria", nextDueDate: at(70) },
  ]);

  const rocoKg = [26.1, 26.8, 27.2, 27.9, 28.3, 28.6];
  const mofKg = [4.1, 4.2, 4.3, 4.3, 4.4, 4.4];
  await Weight.create([
    ...rocoKg.map((kg, i) => ({ owner, petId: roco._id, date: at(-150 + i * 30), kg })),
    ...mofKg.map((kg, i) => ({ owner, petId: mof._id, date: at(-150 + i * 30), kg })),
  ]);

  const expense = (pet, category, euros, days, description) => ({
    owner,
    petId: pet._id,
    category,
    amount: Math.round(euros * 100),
    date: at(days),
    description,
  });

  await Expense.create([
    expense(roco, "food", 54.9, -3, "Saco de pienso 12 kg"),
    expense(roco, "vet", 48, -90, "Revisión anual"),
    expense(roco, "grooming", 35, -12, "Peluquería"),
    expense(roco, "toys", 12.5, -8, "Pelotas y mordedor"),
    expense(roco, "vaccines", 42, -35, "Antiparasitario"),
    expense(roco, "training", 60, -20, "Clases de adiestramiento"),
    expense(roco, "food", 54.9, -33, "Saco de pienso 12 kg"),
    expense(roco, "food", 54.9, -63, "Saco de pienso 12 kg"),
    expense(mof, "food", 28.4, -5, "Pienso y latas"),
    expense(mof, "vaccines", 38, -150, "Trivalente"),
    expense(mof, "vet", 25, -18, "Consulta"),
    expense(mof, "toys", 9.9, -10, "Rascador"),
    expense(mof, "food", 28.4, -35, "Pienso y latas"),
    expense(mof, "boarding", 90, -48, "Cuidador en fin de semana"),
  ]);

  return user;
};
