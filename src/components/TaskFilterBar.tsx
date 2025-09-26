import React from 'react';
import { TaskFilter } from '../types';

interface TaskFilterBarProps {
  current: TaskFilter;
  onChange: (filter: TaskFilter) => void;
  counts: { total: number; completed: number; incomplete: number };
}
    
const FILTER_LABELS: Record<TaskFilter, string> = {
    [TaskFilter.ALL]: 'All',
    [TaskFilter.COMPLETED]: 'Completed',
    [TaskFilter.INCOMPLETE]: 'Incomplete',
    [TaskFilter.PENDING]: 'Pending',
    [TaskFilter.IN_PROGRESS]: 'In Progress',
};

const TaskFilterBar: React.FC<TaskFilterBarProps> = ({ current, onChange, counts }) => {
  return (
    <div className="task-filter-bar" role="tablist" aria-label="Task filters">
      {(Object.keys(FILTER_LABELS) as TaskFilter[]).map(filter => (
        <button
          key={filter}
          role="tab"
            aria-selected={current === filter}
          className={`filter-btn ${current === filter ? 'active' : ''}`}
          onClick={() => onChange(filter)}
        >
          {FILTER_LABELS[filter]}
          <span className="count-pill">
            {filter === TaskFilter.ALL && counts.total}
            {filter === TaskFilter.COMPLETED && counts.completed}
            {filter === TaskFilter.INCOMPLETE && counts.incomplete}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskFilterBar;
