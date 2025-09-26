import React from 'react';
import { TaskStatus } from '../types';

interface StatusBadgeProps { status: TaskStatus }

const STATUS_META: Record<TaskStatus, { label: string; color: string; dot: string }> = {
  pending: { label: 'Pending', color: '#475569', dot: '#cbd5e1' },
  in_progress: { label: 'In Progress', color: '#b45309', dot: '#fbbf24' },
  completed: { label: 'Completed', color: '#166534', dot: '#22c55e' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const meta = STATUS_META[status];
  return (
    <span className="status-badge" data-status={status} style={{ color: meta.color }}>
      <span className="dot" style={{ background: meta.dot }} />
      {meta.label}
    </span>
  );
};

export default StatusBadge;
