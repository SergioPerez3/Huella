import { useState } from "react";
import {
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  skipTask,
} from "../services/taskService.js";

const useTaskActions = (onChanged) => {
  const [error, setError] = useState("");

  const run = async (action) => {
    setError("");
    try {
      await action();
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    error,
    complete: (task) => run(() => completeTask(task._id)),
    skip: (task) => run(() => skipTask(task._id)),
    remove: (task) => run(() => deleteTask(task._id)),
    save: async (task, body) => {
      if (task) await updateTask(task._id, body);
      else await createTask(body);
      onChanged();
    },
  };
};

export default useTaskActions;
