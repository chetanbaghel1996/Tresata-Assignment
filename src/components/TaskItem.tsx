import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import WatchIcon from "../icons/WatchIcon";
import type { Task } from "../types";
import IconButton from "./IconButton";
import StatusBadge from "./StatusBadge";

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onOpenEdit: (task: Task) => void;
}

const formatDate = (d: Date) => {
  try {
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
};
export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onOpenEdit,
}) => {
  const dateStr = formatDate(task.createdAt);

  return (
    <div className={`task-item`}>
      <div className="watch-icon">
        <WatchIcon />
      </div>
      <div className="task-details">
        <div
          className="detail-box"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.8rem",
          }}
        >
          <h3
            className="task-title"
            style={{
              fontSize: "0.8rem",
              fontWeight: "semibold",
              color: "var(--c-brand)",
              margin: 0,
            }}
          >
            {task.title}
          </h3>
          <StatusBadge status={task.status} />
        </div>

        {task.description && <p className="ti-desc">{task.description}</p>}
        <div className="ti-act">
          <div className="ti-meta">
            <time dateTime={task.createdAt.toISOString()}>{dateStr}</time>
          </div>
          <div className="task-actions">
            <IconButton icon={<EditIcon />} onClick={() => onOpenEdit(task)} />
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => onDelete(task.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TaskItem;
