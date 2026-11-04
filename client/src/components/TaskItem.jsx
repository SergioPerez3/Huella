import {
  FiRepeat,
  FiEdit2,
  FiSkipForward,
  FiTrash2,
  FiCheck,
} from "react-icons/fi";
import {
  taskTypes,
  recurrenceLabels,
  formatTime,
  formatDateTime,
} from "../utils/tasks.js";

const TaskItem = ({
  task,
  petName,
  showDate,
  onComplete,
  onSkip,
  onEdit,
  onDelete,
}) => {
  const type = taskTypes[task.type] || taskTypes.other;
  const pending = task.status === "pending";
  const overdue = pending && new Date(task.dueAt) < new Date();
  const repeats =
    task.recurrence?.frequency && task.recurrence.frequency !== "none";
  const when = showDate ? formatDateTime(task.dueAt) : formatTime(task.dueAt);

  return (
    <li className={`task-item ${pending ? "" : "is-closed"}`}>
      <button
        type="button"
        className="check"
        style={{
          borderColor: type.color,
          background: task.status === "done" ? type.color : "#fff",
        }}
        onClick={() => onComplete(task)}
        disabled={!pending}
        aria-label={
          pending
            ? `Completar ${task.title}`
            : task.status === "done"
              ? "Completada"
              : "Omitida"
        }
      >
        {task.status === "done" && <FiCheck aria-hidden="true" />}
      </button>

      <div className="task-main">
        <strong>{task.title}</strong>
        <span className={`muted ${overdue ? "text-danger" : ""}`}>
          {petName && `${petName} · `}
          {when}
          {task.status === "skipped" && " · Omitida"}
        </span>
      </div>

      {repeats && (
        <FiRepeat
          className="muted"
          title={recurrenceLabels[task.recurrence.frequency]}
        />
      )}
      <span
        className="dot"
        style={{ background: type.color }}
        title={type.label}
      />

      {pending && (
        <>
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(task)}
            aria-label="Editar tarea"
            title="Editar"
          >
            <FiEdit2 aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => onSkip(task)}
            aria-label="Omitir tarea"
            title="Omitir"
          >
            <FiSkipForward aria-hidden="true" />
          </button>
        </>
      )}
      <button
        type="button"
        className="icon-btn danger"
        onClick={() => onDelete(task)}
        aria-label="Eliminar tarea"
        title="Eliminar"
      >
        <FiTrash2 aria-hidden="true" />
      </button>
    </li>
  );
};

export default TaskItem;
