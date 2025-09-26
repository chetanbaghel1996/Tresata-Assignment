import React from "react";
import type { Task } from "../types";
import TaskItem from "./TaskItem";
interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onOpenEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onOpenEdit }) => {
  const handleDelete = (id: string) => {
    onDelete(id);
  };

  if (tasks.length === 0)
    return <div className="empty-state">No tasks in this section.</div>;

  return (
    <div className="task-group-list">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onDelete={handleDelete}
          onOpenEdit={onOpenEdit}
        />
      ))}
    </div>
  );
};

export default TaskList;
