import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  taskTypes,
  recurrenceLabels,
  toLocalInput,
  fromLocalInput,
  localDateKey,
  endOfDay,
} from "../utils/tasks.js";

const units = { daily: "días", weekly: "semanas", monthly: "meses" };

const buildForm = (task, pets, defaultDate) => ({
  petId: task?.petId || pets[0]?._id || "",
  title: task?.title || "",
  type: task?.type || "walk",
  dueAt: task ? toLocalInput(task.dueAt) : `${defaultDate}T09:00`,
  description: task?.description || "",
  frequency: task?.recurrence?.frequency || "none",
  interval: task?.recurrence?.interval || 1,
  until: task?.recurrence?.until ? localDateKey(task.recurrence.until) : "",
});

const toBody = (form, isEdit) => {
  const repeats = form.frequency !== "none";
  const body = {
    title: form.title,
    type: form.type,
    dueAt: fromLocalInput(form.dueAt),
    description: form.description,
    recurrence: {
      frequency: form.frequency,
      interval: Number(form.interval) || 1,
      until: repeats && form.until ? endOfDay(form.until) : null,
    },
  };
  if (!isEdit) body.petId = form.petId;
  return body;
};

const TaskForm = ({ task, pets, defaultDate, onSave, onClose }) => {
  const [form, setForm] = useState(buildForm(task, pets, defaultDate));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSave(toBody(form, Boolean(task)));
      onClose();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (pets.length === 0) {
    return (
      <div className="form">
        <h2>Nueva tarea</h2>
        <p className="muted">
          Necesitas al menos una mascota para crear tareas.
        </p>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cerrar
          </button>
          <Link to="/pets/new" className="btn btn-primary">
            Añadir mascota
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{task ? "Editar tarea" : "Nueva tarea"}</h2>

      <div className="field">
        <label htmlFor="task-pet">Mascota</label>
        <select
          id="task-pet"
          name="petId"
          value={form.petId}
          onChange={handleChange}
          disabled={Boolean(task)}
        >
          {pets.map((pet) => (
            <option key={pet._id} value={pet._id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="task-title">Título</label>
        <input
          id="task-title"
          name="title"
          placeholder="Ej: Paseo de la mañana"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="task-type">Tipo</label>
          <select
            id="task-type"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            {Object.entries(taskTypes).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="task-due">Fecha y hora</label>
          <input
            id="task-due"
            type="datetime-local"
            name="dueAt"
            value={form.dueAt}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="task-description">Descripción</label>
        <textarea
          id="task-description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label htmlFor="task-frequency">Repetición</label>
        <select
          id="task-frequency"
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
        >
          {Object.entries(recurrenceLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {form.frequency !== "none" && (
        <div className="form-row">
          <div className="field">
            <label htmlFor="task-interval">
              Cada ({units[form.frequency]})
            </label>
            <input
              id="task-interval"
              type="number"
              name="interval"
              min="1"
              max="52"
              value={form.interval}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="task-until">Hasta (opcional)</label>
            <input
              id="task-until"
              type="date"
              name="until"
              value={form.until}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      {error && <p role="alert">{error}</p>}
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
};

const TaskDialog = ({ open, task, pets, defaultDate, onSave, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="dialog dialog-wide" onCancel={onClose}>
      {open && (
        <TaskForm
          key={task?._id || "new"}
          task={task}
          pets={pets}
          defaultDate={defaultDate}
          onSave={onSave}
          onClose={onClose}
        />
      )}
    </dialog>
  );
};

export default TaskDialog;
