import { useState, useEffect, useMemo } from "react";
import type { Task, TaskStatus } from "../types";
import { TaskStatus as StatusConst } from "../types";

const STORAGE_KEY = "taskManager_tasks";
const LEGACY_KEYS = ["tasks", "todo_tasks"];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") return [];

    const tryParse = (raw: string | null): unknown => {
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.warn("Failed to JSON.parse stored tasks", e);
        return null;
      }
    };

    const rawPrimary = tryParse(localStorage.getItem(STORAGE_KEY));
    let source: unknown = rawPrimary;
    if (!Array.isArray(rawPrimary)) {
      for (const k of LEGACY_KEYS) {
        const alt = tryParse(localStorage.getItem(k));
        if (Array.isArray(alt)) {
          source = alt;
          break;
        }
      }
    }

    if (!Array.isArray(source)) return [];

    const generateId = () =>
      `task_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    interface RawTask {
      id?: string;
      title?: string;
      description?: string;
      completed?: unknown;
      status?: TaskStatus;
      createdAt?: string;
      updatedAt?: string;
      priority?: "low" | "medium" | "high";
    }

    const parsed: Task[] = (source as unknown[]).map((raw) => {
      if (typeof raw !== "object" || raw === null) {
        const now = new Date();
        return {
          id: generateId(),
          title: "Untitled",
          description: undefined,
          completed: false,
          status: StatusConst.PENDING,
          createdAt: now,
          updatedAt: now,
        };
      }
      const r = raw as RawTask;
      const completed = Boolean(r.completed);
      const status: TaskStatus = r.status
        ? r.status
        : completed
        ? StatusConst.COMPLETED
        : StatusConst.PENDING;
      return {
        id: r.id ? String(r.id) : generateId(),
        title: r.title ? String(r.title) : "Untitled",
        description: r.description ? String(r.description) : undefined,
        completed,
        status,
        createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt) : new Date(),
        priority: r.priority,
      };
    });
    return parsed;
  });
  const [search, setSearch] = useState("");

  const generateId = () =>
    `task_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  useEffect(() => {
    try {
      const serialisable = tasks.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialisable));
    } catch (e) {
      console.error("Failed to persist tasks", e);
    }
  }, [tasks]);

  const addTask = (
    title: string,
    description?: string,
    status: TaskStatus = StatusConst.PENDING
  ) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const now = new Date();
    setTasks((prev) => [
      {
        id: generateId(),
        title: trimmed,
        description: description?.trim() || undefined,
        completed: status === StatusConst.COMPLETED,
        status,
        createdAt: now,
        updatedAt: now,
      },
      ...prev,
    ]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              status: t.completed ? StatusConst.PENDING : StatusConst.COMPLETED,
              updatedAt: new Date(),
            }
          : t
      )
    );
  };

  const updateStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              completed: status === StatusConst.COMPLETED,
              updatedAt: new Date(),
            }
          : t
      )
    );
  };

  const editTask = (
    id: string,
    title?: string,
    description?: string,
    status?: TaskStatus
  ) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const updated: Task = { ...task };
        if (title !== undefined) {
          const t = title.trim();
          if (t) updated.title = t;
        }
        if (description !== undefined) {
          const d = description.trim();
          updated.description = d || undefined;
        }
        if (status) {
          updated.status = status;
          updated.completed = status === StatusConst.COMPLETED;
        }
        updated.updatedAt = new Date();
        return updated;
      })
    );
  };

  const taskStats = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((t) => t.status === StatusConst.COMPLETED).length,
      inProgress: tasks.filter((t) => t.status === StatusConst.IN_PROGRESS)
        .length,
      pending: tasks.filter((t) => t.status === StatusConst.PENDING).length,
    }),
    [tasks]
  );

  return {
    tasks,
    addTask,
    deleteTask,
    toggleTask,
    editTask,
    updateStatus,
    search,
    setSearch,
    taskStats,
  };
};
