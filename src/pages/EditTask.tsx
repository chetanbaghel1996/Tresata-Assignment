import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { TaskStatus } from "../types";
import { useTasks } from "../hooks/useTasks";
import AddEditTaskForm from "../components/AddEditTaskForm";

interface EditTaskProps {
  mode: "add" | "edit";
  submitLabel?: string;
  taskId?: string; // For edit mode
}

const EditTask: React.FC<EditTaskProps> = ({ mode, submitLabel, taskId }) => {
  const navigate = useNavigate();
  const route = useParams();
  const { addTask, editTask, tasks } = useTasks();
  const isAdd = mode === "add";

  const initialTask =
    !isAdd && (taskId || route.id)
      ? tasks.find((t) => t.id === (taskId || route.id))
      : undefined;

  const onSubmit = (data: {
    title: string;
    description: string;
    status: TaskStatus;
  }) => {
    try {
      if (mode === "add") {
        addTask(data.title, data.description, data.status);
        console.log("Task added successfully:", data);
      } else if (mode === "edit") {
        // Use taskId prop or route.id parameter
        const currentTaskId = taskId || route.id;
        if (currentTaskId && initialTask) {
          editTask(currentTaskId, data.title, data.description, data.status);
          console.log("Task updated successfully:", data);
        } else {
          console.error("No task ID found for editing");
          return;
        }
      }

      // Navigate back to the main task list
      navigate("/");
    } catch (error) {
      console.error("Error saving task:", error);
      // You could add error handling here (show toast, etc.)
    }
  };

  const onCancel = () => {
    navigate("/");
  };

  return (
    <AddEditTaskForm
      mode={mode}
      initial={
        initialTask
          ? {
              title: initialTask.title,
              description: initialTask.description,
              status: initialTask.status,
            }
          : undefined
      }
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitLabel={submitLabel}
    />
  );
};

export default EditTask;
