import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import {
  FiCalendar,
  FiHeart,
  FiAlertCircle,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import useAuth from "../hooks/useAuth.js";
import { getDashboard } from "../services/dashboardService.js";
import { getAge } from "../utils/age.js";
import { formatDate } from "../utils/format.js";
import { healthTypes } from "../utils/health.js";
import {
  taskTypes,
  formatTime,
  formatDateTime,
  localDateKey,
} from "../utils/tasks.js";
import { taskIcons } from "../utils/taskIcons.js";
import { dayDiff, dueText } from "../utils/dates.js";
import ExpenseDonut from "../components/ExpenseDonut.jsx";

const speciesLabel = { dog: "Perro", cat: "Gato", other: "Otro" };

const TaskRow = ({ task, petName, showDate }) => {
  const type = taskTypes[task.type] || taskTypes.other;
  const Icon = taskIcons[task.type] || taskIcons.other;
  return (
    <li className="dash-task">
      <span
        className="task-icon"
        style={{ background: `${type.color}1f`, color: type.color }}
      >
        <Icon aria-hidden="true" />
      </span>
      <div className="mini-main">
        <strong>{task.title}</strong>
        <span className="muted">
          <span className="pet-tag">{petName}</span> ·{" "}
          {showDate ? formatDateTime(task.dueAt) : formatTime(task.dueAt)}
        </span>
      </div>
    </li>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!data) return <p className="muted">Cargando...</p>;

  const { pets, tasks, upcomingHealth, latestWeights, monthExpenses } = data;
  const petName = (id) => pets.find((p) => p._id === id)?.name;
  const weightOf = (id) =>
    latestWeights.find((w) => String(w.petId) === id)?.weights[0]?.kg;
  const monthName = new Date().toLocaleDateString("es-ES", { month: "long" });

  const todayKey = localDateKey(new Date());
  const todayTasks = tasks.upcoming.filter(
    (t) => localDateKey(t.dueAt) === todayKey,
  );
  const laterTasks = tasks.upcoming.filter(
    (t) => localDateKey(t.dueAt) !== todayKey,
  );

  const [nextVisit, ...otherVisits] = upcomingHealth;

  return (
    <section className="dashboard">
      <div className="page-header">
        <div>
          <h1>¡Hola, {user?.name}!</h1>
          <p className="muted">Aquí tienes un resumen de lo más importante.</p>
        </div>
        <Link to="/pets" className="link-more">
          Ver todas las mascotas
        </Link>
      </div>

      <div className="dash-top">
        {pets.length === 0 ? (
          <div className="card empty-state">
            <FaPaw aria-hidden="true" size={32} />
            <p>Añade tu primera mascota para empezar.</p>
            <Link to="/pets/new" className="btn btn-primary">
              Añadir mascota
            </Link>
          </div>
        ) : (
          <ul className="dash-pets">
            {pets.map((pet) => {
              const kg = weightOf(pet._id);
              const details = [
                pet.breed || speciesLabel[pet.species],
                getAge(pet.birthDate),
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <li key={pet._id}>
                  <Link to={`/pets/${pet._id}`} className="pet-tile">
                    <div className="pet-tile-photo">
                      {pet.photo?.url ? (
                        <img src={pet.photo.url} alt="" />
                      ) : (
                        <FaPaw aria-hidden="true" />
                      )}
                    </div>
                    <div className="pet-tile-body">
                      <strong>{pet.name}</strong>
                      <span className="muted">{details}</span>
                      <span className="muted">
                        {kg ? `${kg} kg` : "Sin peso registrado"}
                      </span>
                      <span
                        className={`chip ${pet.inTreatment ? "chip-warn" : ""}`}
                      >
                        {pet.inTreatment ? (
                          <FiAlertCircle aria-hidden="true" />
                        ) : (
                          <FiHeart aria-hidden="true" />
                        )}
                        {pet.inTreatment ? "En tratamiento" : "Saludable"}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
            <li>
              <Link to="/pets/new" className="pet-tile pet-tile-add">
                <FiPlus aria-hidden="true" size={30} />
                <span>Añadir mascota</span>
              </Link>
            </li>
          </ul>
        )}

        <aside className="next-visit">
          <FaPaw className="next-visit-deco" aria-hidden="true" />
          <div className="next-visit-head">
            <FiCalendar aria-hidden="true" /> Próxima cita
          </div>
          {nextVisit ? (
            <>
              <p className="next-visit-date">
                {formatDate(nextVisit.nextDueDate)}
              </p>
              <span className="next-visit-when">
                {dueText(dayDiff(nextVisit.nextDueDate))}
              </span>
              <strong className="next-visit-title">{nextVisit.title}</strong>
              <span className="next-visit-sub">
                {healthTypes[nextVisit.type]} · {petName(nextVisit.petId)}
              </span>
              {otherVisits.length > 0 && (
                <ul className="next-visit-more">
                  {otherVisits.slice(0, 2).map((record) => (
                    <li key={record._id}>
                      <span>
                        {record.title} · {petName(record.petId)}
                      </span>
                      <span>{formatDate(record.nextDueDate)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <p className="next-visit-date">Sin citas</p>
              <span className="next-visit-sub">
                Programa la próxima revisión o vacuna desde la ficha de tu
                mascota.
              </span>
            </>
          )}
          <Link to="/health" className="btn btn-light">
            Ver detalles <FiArrowRight aria-hidden="true" />
          </Link>
        </aside>
      </div>

      <div className="dash-grid">
        <section className="card">
          <div className="section-head">
            <h2>Tareas de hoy</h2>
            <Link to="/tasks" className="link-more">
              Ver tareas
            </Link>
          </div>
          {tasks.overdue > 0 && (
            <Link to="/tasks" className="alert-chip">
              {tasks.overdue}{" "}
              {tasks.overdue === 1 ? "tarea atrasada" : "tareas atrasadas"}
            </Link>
          )}
          {todayTasks.length === 0 ? (
            <p className="muted">No tienes tareas pendientes para hoy.</p>
          ) : (
            <ul className="mini-list">
              {todayTasks.map((task) => (
                <TaskRow
                  key={task._id}
                  task={task}
                  petName={petName(task.petId)}
                />
              ))}
            </ul>
          )}
        </section>

        <section className="card dash-expenses">
          <div className="section-head">
            <h2>Gastos de {monthName}</h2>
            <Link to="/expenses" className="link-more">
              Ver gastos
            </Link>
          </div>
          {monthExpenses.count === 0 ? (
            <p className="muted">Todavía no hay gastos este mes.</p>
          ) : (
            <ExpenseDonut
              byCategory={monthExpenses.byCategory}
              total={monthExpenses.total}
            />
          )}
        </section>

        <section className="card">
          <div className="section-head">
            <h2>Próximas tareas</h2>
            <Link to="/calendar" className="link-more">
              Ver calendario
            </Link>
          </div>
          {laterTasks.length === 0 ? (
            <p className="muted">No hay más tareas programadas.</p>
          ) : (
            <ul className="mini-list">
              {laterTasks.map((task) => (
                <TaskRow
                  key={task._id}
                  task={task}
                  petName={petName(task.petId)}
                  showDate
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="dash-banner">
        <FaPaw className="dash-banner-deco" aria-hidden="true" />
        <div>
          <h2>Porque ellos también forman parte de tu vida</h2>
          <p>Cuida de cada detalle: salud, tareas y gastos en un solo lugar.</p>
        </div>
        <Link to="/calendar" className="btn btn-light">
          Ver calendario
        </Link>
      </div>
    </section>
  );
};

export default Dashboard;
