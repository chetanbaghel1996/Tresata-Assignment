import React, { useState, useEffect } from 'react';
import type { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onQuickComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onQuickComplete, onDelete, onOpenEdit }) => {
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [prevTaskIds, setPrevTaskIds] = useState<Set<string>>(new Set());

  // Track task additions for animations
  useEffect(() => {
    const currentTaskIds = new Set(tasks.map(t => t.id));
    const newItems = new Set([...currentTaskIds].filter(id => !prevTaskIds.has(id)));

    // Animate new items
    if (newItems.size > 0) {
      setAnimatingItems(prev => new Set([...prev, ...newItems]));
      setTimeout(() => {
        setAnimatingItems(prev => {
          const updated = new Set(prev);
          newItems.forEach(id => updated.delete(id));
          return updated;
        });
      }, 500); // Animation duration
    }

    setPrevTaskIds(currentTaskIds);
  }, [tasks, prevTaskIds]);

  const handleDelete = (id: string) => {
    setRemovingItems(prev => new Set([...prev, id]));
    setTimeout(() => {
      onDelete(id);
      setRemovingItems(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }, 300); // Exit animation duration
  };

  if (tasks.length === 0) return <div className="empty-state">No tasks in this section.</div>;
  
  return (
    <ul className="task-group-list">
      {tasks.map(t => (
        <TaskItem 
          key={t.id} 
          task={t} 
          onQuickComplete={onQuickComplete} 
          onDelete={handleDelete} 
          onOpenEdit={onOpenEdit}
          isAnimating={animatingItems.has(t.id)}
          isRemoving={removingItems.has(t.id)}
        />
      ))}
    </ul>
  );
};

export default TaskList;
