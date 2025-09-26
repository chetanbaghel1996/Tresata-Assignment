export const TaskStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  priority?: "low" | "medium" | "high";
}

export const TaskFilter = {
  ALL: "all",
  COMPLETED: "completed",
  INCOMPLETE: "incomplete",
  IN_PROGRESS: "in_progress",
  PENDING: "pending",
} as const;

export type TaskFilter = (typeof TaskFilter)[keyof typeof TaskFilter];

export type TaskAction =
  | {
      type: "ADD_TASK";
      payload: { title: string; description?: string; status?: TaskStatus };
    }
  | { type: "DELETE_TASK"; payload: { id: string } }
  | { type: "TOGGLE_TASK"; payload: { id: string } }
  | {
      type: "EDIT_TASK";
      payload: {
        id: string;
        title?: string;
        description?: string;
        status?: TaskStatus;
      };
    }
  | { type: "SET_TASKS"; payload: { tasks: Task[] } };

export interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  currentFilter: TaskFilter;
  addTask: (title: string, description?: string, status?: TaskStatus) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  editTask: (
    id: string,
    title?: string,
    description?: string,
    status?: TaskStatus
  ) => void;
  setFilter: (filter: TaskFilter) => void;
  updateStatus: (id: string, status: TaskStatus) => void;
  search: string;
  setSearch: (value: string) => void;
  taskStats: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
}
