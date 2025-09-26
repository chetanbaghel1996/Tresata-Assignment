import './App.css';
import React, { useState, useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import { TaskStatus } from './types';
import PageHeader from './components/PageHeader';
import SearchBar from './components/SearchBar';
import CollapsibleSection from './components/CollapsibleSection';
import TaskList from './components/TaskList';
import AddEditTaskForm from './components/AddEditTaskForm';

type ViewMode = 'list' | 'add' | 'edit';

const App: React.FC = () => {
  const { tasks, addTask, deleteTask, toggleTask, editTask, search, setSearch } = useTasks();
  const [mode, setMode] = useState<ViewMode>('list');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask = useMemo(() => tasks.find(t => t.id === selectedTaskId) || null, [tasks, selectedTaskId]);

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = !q ? tasks : tasks.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    return list;
  }, [tasks, search]);

  const inProgress = filteredSorted.filter(t => t.status === TaskStatus.IN_PROGRESS);
  const pending = filteredSorted.filter(t => t.status === TaskStatus.PENDING);
  const completed = filteredSorted.filter(t => t.status === TaskStatus.COMPLETED);

  const showStatus: Record<TaskStatus, boolean> = {
    [TaskStatus.IN_PROGRESS]: true,
    [TaskStatus.PENDING]: true,
    [TaskStatus.COMPLETED]: true,
  };

  return (
    <div className={`layout ${mode !== 'list' ? 'detail-mode' : ''}`}>
      {mode === 'list' && (
        <div className="panel list-panel">
          <div className="brand-bar">
            <h2>TO-DO APP</h2>
          </div>
          <SearchBar value={search} onChange={setSearch} />
          <div className="sections">
            {showStatus[TaskStatus.IN_PROGRESS] && (
              <CollapsibleSection title="In Progress" count={inProgress.length}>
                <TaskList tasks={inProgress} onQuickComplete={toggleTask} onDelete={deleteTask} onOpenEdit={(t)=> { setSelectedTaskId(t.id); setMode('edit'); }} />
              </CollapsibleSection>
            )}
            {showStatus[TaskStatus.PENDING] && (
              <CollapsibleSection title="Pending" count={pending.length} defaultOpen={false}>
                <TaskList tasks={pending} onQuickComplete={toggleTask} onDelete={deleteTask} onOpenEdit={(t)=> { setSelectedTaskId(t.id); setMode('edit'); }} />
              </CollapsibleSection>
            )}
            {showStatus[TaskStatus.COMPLETED] && (
              <CollapsibleSection title="Completed" count={completed.length} defaultOpen={false}>
                <TaskList tasks={completed} onQuickComplete={toggleTask} onDelete={deleteTask} onOpenEdit={(t)=> { setSelectedTaskId(t.id); setMode('edit'); }} />
              </CollapsibleSection>
            )}
            <button
              type="button"
              className="fab-add in-panel"
              aria-label="Add Task"
              onClick={() => { setMode('add'); setSelectedTaskId(null); }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-7-7h14"/></svg>
            </button>
          </div>
        </div>
      )}

      {mode === 'add' && (
        <div className="panel detail-panel">
          <PageHeader title="Add Task" showBack onBack={() => setMode('list')} />
          <AddEditTaskForm mode="add" onCancel={() => setMode('list')} onSubmit={({ title, description, status }) => { addTask(title, description, status); setMode('list'); }} />
        </div>
      )}

      {mode === 'edit' && selectedTask && (
        <div className="panel detail-panel">
          <PageHeader title="Edit Task" showBack onBack={() => setMode('list')} />
          <AddEditTaskForm
            mode="edit"
            initial={{ title: selectedTask.title, description: selectedTask.description, status: selectedTask.status }}
            onCancel={() => setMode('list')}
            onSubmit={({ title, description, status }) => { editTask(selectedTask.id, title, description, status); setMode('list'); }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
