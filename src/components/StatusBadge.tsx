import React from "react";
import { TaskStatus } from "../types";

interface StatusBadgeProps {
  status: TaskStatus;
}

const STATUS_META: Record<
  TaskStatus,
  { label: string; color: string; dot: string }
> = {
  pending: { label: "Pending", color: "#475569", dot: "#D0D0D0" },
  in_progress: { label: "In Progress", color: "#b45309", dot: "#FFB03C" },
  completed: { label: "Completed", color: "#166534", dot: "#368A04" },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const meta = STATUS_META[status];
  return (
    <span
      className="ti-status"
      data-status={status}
      style={{ color: "var(--c-text-main)" }}
    >
      <span className="dot" data-status={status} />
      {meta.label}
    </span>
  );
};

export default StatusBadge;
