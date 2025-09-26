import { useMemo } from "react";
import SearchBar from "../components/SearchBar";
import AddTaskButton from "../components/AddTaskButton";
import CollapsibleSection from "../components/CollapsibleSection";
import { TaskStatus, type Task } from "../types";
import { useTasks } from "../hooks/useTasks";
import { useNavigate } from "react-router-dom";
import TaskList from "../components/TaskList";

export const TaskListPage = () => {
  const navigate = useNavigate();
  const { tasks, deleteTask, search, setSearch } = useTasks();
  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = !q
      ? tasks
      : tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q)
        );
    return list;
  }, [tasks, search]);

  const inProgress = filteredSorted.filter(
    (t) => t.status === TaskStatus.IN_PROGRESS
  );
  const pending = filteredSorted.filter((t) => t.status === TaskStatus.PENDING);
  const completed = filteredSorted.filter(
    (t) => t.status === TaskStatus.COMPLETED
  );

  const showStatus: Record<TaskStatus, boolean> = {
    [TaskStatus.IN_PROGRESS]: true,
    [TaskStatus.PENDING]: true,
    [TaskStatus.COMPLETED]: true,
  };

  return (
    <>
      <div className="task-list-content">
        <SearchBar value={search} onChange={setSearch} />
        <div
          className="task-sections"
          style={{
            marginTop: "24px",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {showStatus[TaskStatus.IN_PROGRESS] && (
            <CollapsibleSection
              title="In Progress"
              count={inProgress.length}
              defaultOpen={false}
            >
              <TaskList
                tasks={inProgress}
                onDelete={deleteTask}
                onOpenEdit={(t: Task) => {
                  navigate(`/edit/${t.id}`);
                }}
              />
            </CollapsibleSection>
          )}
          {showStatus[TaskStatus.PENDING] && (
            <CollapsibleSection
              title="Pending"
              count={pending.length}
              defaultOpen={false}
            >
              <TaskList
                tasks={pending}
                onDelete={deleteTask}
                onOpenEdit={(t: Task) => {
                  navigate(`/edit/${t.id}`);
                }}
              />
            </CollapsibleSection>
          )}
          {showStatus[TaskStatus.COMPLETED] && (
            <CollapsibleSection
              title="Completed"
              count={completed.length}
              defaultOpen={false}
            >
              <TaskList
                tasks={completed}
                onDelete={deleteTask}
                onOpenEdit={(t: Task) => {
                  navigate(`/edit/${t.id}`);
                }}
              />
            </CollapsibleSection>
          )}
        </div>

        {/* Task items would be rendered here based on searchTerm */}
        <AddTaskButton />
      </div>
    </>
  );
};
export default TaskListPage;
