import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { FiPlus } from "react-icons/fi";
import { getTasks } from "../services/taskService.js";
import usePets from "../hooks/usePets.js";
import useTaskActions from "../hooks/useTaskActions.js";
import { taskTypes, localDateKey, formatLongDate } from "../utils/tasks.js";
import TaskItem from "../components/TaskItem.jsx";
import TaskDialog from "../components/TaskDialog.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const Calendar = () => {
  const pets = usePets();
  const [range, setRange] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [version, setVersion] = useState(0);
  const [selected, setSelected] = useState(localDateKey(new Date()));
  const [dialog, setDialog] = useState({ open: false, task: null });
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => setVersion((v) => v + 1);
  const actions = useTaskActions(refresh);

  useEffect(() => {
    if (!range) return;
    getTasks({ from: range.from, to: range.to, limit: 200 })
      .then((res) => {
        setTasks(res.data);
        setLoadError("");
      })
      .catch((err) => setLoadError(err.message));
  }, [range, version]);

  const handleDatesSet = (info) => {
    const from = info.start.toISOString();
    const to = info.end.toISOString();
    setRange((prev) =>
      prev && prev.from === from && prev.to === to ? prev : { from, to },
    );
  };

  const handleDelete = async () => {
    setBusy(true);
    await actions.remove(toDelete);
    setToDelete(null);
    setBusy(false);
  };

  const petName = (id) => pets.find((p) => p._id === id)?.name;

  const events = tasks.map((task) => {
    const color = (taskTypes[task.type] || taskTypes.other).color;
    return {
      id: task._id,
      title: task.title,
      start: task.dueAt,
      backgroundColor: color,
      borderColor: color,
      classNames: task.status === "pending" ? [] : ["fc-closed"],
      extendedProps: { dateKey: localDateKey(task.dueAt) },
    };
  });

  const dayTasks = tasks
    .filter((task) => localDateKey(task.dueAt) === selected)
    .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));

  return (
    <section>
      <div className="page-header">
        <h1>Calendario</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setDialog({ open: true, task: null })}
        >
          <FiPlus aria-hidden="true" /> Nueva tarea
        </button>
      </div>

      {(loadError || actions.error) && (
        <p role="alert">{loadError || actions.error}</p>
      )}

      <div className="calendar-layout">
        <div className="card calendar-box">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            locale={esLocale}
            initialView={
              window.innerWidth < 768 ? "timeGridDay" : "dayGridMonth"
            }
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            height="auto"
            nowIndicator
            scrollTime="07:00:00"
            dayMaxEvents={3}
            datesSet={handleDatesSet}
            dateClick={(info) => setSelected(localDateKey(info.date))}
            eventClick={(info) => setSelected(info.event.extendedProps.dateKey)}
            dayCellClassNames={(arg) =>
              localDateKey(arg.date) === selected ? ["selected-day"] : []
            }
          />
        </div>

        <aside className="card day-panel">
          <h2>Tareas del día</h2>
          <p className="muted day-label">{formatLongDate(selected)}</p>

          {dayTasks.length === 0 ? (
            <p className="muted">No hay tareas este día.</p>
          ) : (
            <ul className="task-list">
              {dayTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  petName={petName(task.petId)}
                  onComplete={actions.complete}
                  onSkip={actions.skip}
                  onEdit={(t) => setDialog({ open: true, task: t })}
                  onDelete={setToDelete}
                />
              ))}
            </ul>
          )}

          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setDialog({ open: true, task: null })}
          >
            <FiPlus aria-hidden="true" /> Añadir tarea a este día
          </button>
        </aside>
      </div>

      <TaskDialog
        open={dialog.open}
        task={dialog.task}
        pets={pets}
        defaultDate={selected}
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

export default Calendar;
