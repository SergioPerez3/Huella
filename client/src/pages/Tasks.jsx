import { useState, useEffect } from "react";
import { getTasks } from "../services/taskService.js";
import usePets from "../hooks/usePets.js";
import useTaskActions from "../hooks/useTaskActions.js";
import { localDateKey } from "../utils/tasks.js";
import TaskItem from "../components/TaskItem.jsx";
import TaskDialog from "../components/TaskDialog.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import TaskLegend from "../components/TaskLegend.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { FiPlus, FiCheckSquare } from 'react-icons/fi';

const tabs = [
  { key: "pending", label: "Pendientes" },
  { key: "done", label: "Completadas" },
  { key: "skipped", label: "Omitidas" },
];

const emptyText = {
  pending: "No tienes tareas pendientes. ¡Buen trabajo!",
  done: "Todavía no has completado ninguna tarea.",
  skipped: "No hay tareas omitidas.",
};

const Tasks = () => {
  const pets = usePets();
  const [status, setStatus] = useState("pending");
  const [petId, setPetId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [version, setVersion] = useState(0);
  const [dialog, setDialog] = useState({ open: false, task: null });
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => setVersion((v) => v + 1);
  const actions = useTaskActions(refresh);

  useEffect(() => {
    setLoading(true);
    const params = { status, limit: 200 };
    if (petId) params.petId = petId;
    getTasks(params)
      .then((res) => {
        setTasks(res.data);
        setLoadError("");
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [status, petId, version]);

  const petName = (id) => pets.find((p) => p._id === id)?.name;

  const handleDelete = async () => {
    setBusy(true);
    await actions.remove(toDelete);
    setToDelete(null);
    setBusy(false);
  };

  const renderItem = (task) => (
    <TaskItem
      key={task._id}
      task={task}
      petName={petName(task.petId)}
      showDate
      onComplete={actions.complete}
      onSkip={actions.skip}
      onEdit={(t) => setDialog({ open: true, task: t })}
      onDelete={setToDelete}
    />
  );

  const now = Date.now();
  const overdue = tasks.filter((t) => new Date(t.dueAt).getTime() < now);
  const upcoming = tasks.filter((t) => new Date(t.dueAt).getTime() >= now);

  return (
    <section>
      <PageHeader
        icon={FiCheckSquare}
        title="Tareas"
        subtitle="Lo que toca hacer hoy y esta semana"
      >
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setDialog({ open: true, task: null })}
        >
          <FiPlus aria-hidden="true" /> Nueva tarea
        </button>
      </PageHeader>

      <div className="toolbar">
        <nav
          className="tabs tabs-inline"
          role="tablist"
          aria-label="Estado de las tareas"
        >
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={status === key}
              onClick={() => setStatus(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <select
          aria-label="Filtrar por mascota"
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
        >
          <option value="">Todas las mascotas</option>
          {pets.map((pet) => (
            <option key={pet._id} value={pet._id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>
      <TaskLegend />

      {(loadError || actions.error) && (
        <p role="alert">{loadError || actions.error}</p>
      )}
      {loading && <p className="muted">Cargando...</p>}

      {!loading && tasks.length === 0 && (
        <div className="card empty-state">
          <p className="muted">{emptyText[status]}</p>
        </div>
      )}

      {!loading && status === "pending" && (
        <div className="stack">
          {overdue.length > 0 && (
            <section className="card task-section">
              <h2>Atrasadas</h2>
              <ul className="task-list">{overdue.map(renderItem)}</ul>
            </section>
          )}
          {upcoming.length > 0 && (
            <section className="card task-section">
              <h2>Próximas</h2>
              <ul className="task-list">{upcoming.map(renderItem)}</ul>
            </section>
          )}
        </div>
      )}

      {!loading && status !== "pending" && tasks.length > 0 && (
        <section className="card task-section">
          <ul className="task-list">{[...tasks].reverse().map(renderItem)}</ul>
        </section>
      )}

      <TaskDialog
        open={dialog.open}
        task={dialog.task}
        pets={pets}
        defaultDate={localDateKey(new Date())}
        onSave={(body) => actions.save(dialog.task, body)}
        onClose={() => setDialog({ open: false, task: null })}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        busy={busy}
        title="¿Eliminar esta tarea?"
        message="Si es una tarea repetida, solo se elimina esta ocurrencia."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
};

export default Tasks;
