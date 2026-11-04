import { taskTypes } from "../utils/tasks.js";

const TaskLegend = () => (
  <ul className="task-legend" aria-label="Leyenda de tipos de tarea">
    {Object.values(taskTypes).map(({ label, color }) => (
      <li key={label}>
        <span className="dot" style={{ background: color }} />
        {label}
      </li>
    ))}
  </ul>
);

export default TaskLegend;
