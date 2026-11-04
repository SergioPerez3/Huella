import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getWeights } from "../../services/weightService.js";
import { getHealthRecords } from "../../services/healthService.js";
import { getExpenseSummary } from "../../services/expenseService.js";
import { getTasks } from "../../services/taskService.js";
import { healthTypes } from "../../utils/health.js";
import { formatDate, formatShortDate } from "../../utils/format.js";
import { taskTypes, formatDateTime } from "../../utils/tasks.js";
import { dayDiff, dueText } from "../../utils/dates.js";
import ExpenseDonut from "../ExpenseDonut.jsx";

const speciesLabel = { dog: "Perro", cat: "Gato", other: "Otro" };
const sexLabel = { male: "Macho", female: "Hembra" };

const PetSummary = ({ pet }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const month = new Date().toISOString().slice(0, 7);
    setData(null);
    Promise.allSettled([
      getWeights(pet._id),
      getHealthRecords(pet._id),
      getExpenseSummary({ month, petId: pet._id }),
      getTasks({ petId: pet._id, status: "pending", limit: 5 }),
    ]).then(([weights, records, expenses, tasks]) =>
      setData({
        weights: weights.value?.data || [],
        records: records.value?.data || [],
        expenses: expenses.value?.data || null,
        tasks: tasks.value?.data || [],
      }),
    );
  }, [pet._id]);

  if (!data) return <p className="muted">Cargando...</p>;

  const { weights, records, expenses, tasks } = data;
  const latest = weights.at(-1);
  const previous = weights.at(-2);
  const diff = latest && previous ? latest.kg - previous.kg : null;
  const chartData = weights.map((w) => ({
    date: formatShortDate(w.date),
    kg: w.kg,
  }));
  const lastVaccine = records.find((r) => r.type === "vaccine");
  const upcoming = records
    .filter((r) => r.nextDueDate && dayDiff(r.nextDueDate) >= 0)
    .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate))
    .slice(0, 4);

  const rows = [
    ["Especie", speciesLabel[pet.species]],
    ["Raza", pet.breed],
    ["Sexo", sexLabel[pet.sex]],
    ["Fecha de nacimiento", pet.birthDate && formatDate(pet.birthDate)],
    ["Peso actual", latest && `${latest.kg} kg`],
    [
      "Última vacuna",
      lastVaccine && `${lastVaccine.title} · ${formatDate(lastVaccine.date)}`,
    ],
    ["Microchip", pet.microchip],
    ["Observaciones", pet.notes],
  ];

  return (
    <div className="summary-grid">
      <section className="card">
        <h2>Información general</h2>
        <dl className="info-list">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Próximas citas y vacunas</h2>
          <Link to={`/pets/${pet._id}?tab=health`} className="link-more">
            Ver salud
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="muted">No hay nada programado.</p>
        ) : (
          <ul className="health-list">
            {upcoming.map((record) => {
              const days = dayDiff(record.nextDueDate);
              return (
                <li key={record._id} className="health-row">
                  <div className="health-main">
                    <strong>{record.title}</strong>
                    <span className="muted">
                      {healthTypes[record.type]} ·{" "}
                      {formatDate(record.nextDueDate)}
                    </span>
                  </div>
                  <span className={`health-due ${days <= 7 ? "is-soon" : ""}`}>
                    {dueText(days)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Alergias</h2>
        {pet.allergies?.length ? (
          <div className="chip-row">
            {pet.allergies.map((allergy) => (
              <span key={allergy} className="chip chip-warn">
                {allergy}
              </span>
            ))}
          </div>
        ) : (
          <p className="muted">Ninguna registrada.</p>
        )}
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Peso</h2>
          <Link to={`/pets/${pet._id}?tab=weight`} className="link-more">
            Ver peso
          </Link>
        </div>
        {latest ? (
          <>
            <p className="stat">{latest.kg} kg</p>
            {diff !== null && (
              <p className="muted">
                {diff > 0 ? "+" : ""}
                {diff.toFixed(1)} kg respecto al anterior
              </p>
            )}
            {weights.length >= 2 && (
              <div className="mini-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis hide domain={["auto", "auto"]} />
                    <Tooltip formatter={(value) => `${value} kg`} />
                    <Line
                      type="monotone"
                      dataKey="kg"
                      stroke="var(--green-600)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        ) : (
          <p className="muted">Todavía no hay pesos registrados.</p>
        )}
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Gastos del mes</h2>
          <Link to={`/pets/${pet._id}?tab=expenses`} className="link-more">
            Ver gastos
          </Link>
        </div>
        {expenses?.count > 0 ? (
          <ExpenseDonut
            byCategory={expenses.byCategory}
            total={expenses.total}
          />
        ) : (
          <p className="muted">Sin gastos este mes.</p>
        )}
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Próximas tareas</h2>
          <Link to="/tasks" className="link-more">
            Ver tareas
          </Link>
        </div>
        {tasks.length === 0 ? (
          <p className="muted">No hay tareas pendientes.</p>
        ) : (
          <ul className="mini-list">
            {tasks.map((task) => (
              <li key={task._id}>
                <span
                  className="dot"
                  style={{
                    background: (taskTypes[task.type] || taskTypes.other).color,
                  }}
                />
                <div className="mini-main">
                  <strong>{task.title}</strong>
                  <span className="muted">{formatDateTime(task.dueAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default PetSummary;
