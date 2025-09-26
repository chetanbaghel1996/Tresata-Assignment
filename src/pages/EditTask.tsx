import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TaskStatus } from "../types";
import { useTasks } from "../hooks/useTasks";

interface EditTaskProps {
  mode: "add" | "edit";
  initial?: { title?: string; description?: string; status?: TaskStatus };
  submitLabel?: string;
  taskId?: string; // For edit mode
}

const TITLE_MAX = 120;
const DESC_MAX = 500;

const statusOptions: TaskStatus[] = [
  TaskStatus.PENDING,
  TaskStatus.IN_PROGRESS,
  TaskStatus.COMPLETED,
];

const EditTask: React.FC<EditTaskProps> = ({ mode, submitLabel, taskId }) => {
  const navigate = useNavigate();
  const route = useParams();
  const { addTask, editTask, tasks } = useTasks();
  const isAdd = mode === "add";
  const initialTask =
    !isAdd && (taskId || route.id)
      ? tasks.find((t) => t.id === (taskId || route.id))
      : undefined;
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || ""
  );
  const [status, setStatus] = useState<TaskStatus>(
    initialTask?.status || TaskStatus.PENDING
  );
  const [statusOpen, setStatusOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [activeStatusIndex, setActiveStatusIndex] = useState(0);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const titleValid = title.trim().length > 0;

  const onSubmit = (data: {
    title: string;
    description: string;
    status: TaskStatus;
  }) => {
    try {
      if (mode === "add") {
        addTask(data.title, data.description, data.status);
        console.log("Task added successfully:", data);
      } else if (mode === "edit") {
        // Use taskId prop or route.id parameter
        const currentTaskId = taskId || route.id;
        if (currentTaskId && initialTask) {
          editTask(currentTaskId, data.title, data.description, data.status);
          console.log("Task updated successfully:", data);
        } else {
          console.error("No task ID found for editing");
          return;
        }
      }

      // Navigate back to the main task list
      navigate("/");
    } catch (error) {
      console.error("Error saving task:", error);
      // You could add error handling here (show toast, etc.)
    }
  };

  const onCancel = () => {
    navigate("/");
  };

  useEffect(() => {
    if (statusOpen) {
      setActiveStatusIndex(statusOptions.findIndex((o) => o === status));
    }
  }, [statusOpen, status]);

  const closeStatus = useCallback(() => setStatusOpen(false), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!statusOpen) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        closeStatus();
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [statusOpen, closeStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!titleValid) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status: isAdd ? TaskStatus.PENDING : status,
    });
  };

  const onKeyDownStatus = (e: React.KeyboardEvent) => {
    if (!statusOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveStatusIndex((i) => (i + 1) % statusOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveStatusIndex(
        (i) => (i - 1 + statusOptions.length) % statusOptions.length
      );
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const st = statusOptions[activeStatusIndex];
      setStatus(st);
      closeStatus();
      triggerRef.current?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeStatus();
      triggerRef.current?.focus();
    }
  };

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
      aria-label={isAdd ? "Add Task Form" : "Edit Task Form"}
    >
      <div
        className={`field-group ${touched && !titleValid ? "has-error" : ""}`}
      >
        <label className="visually-hidden" htmlFor="taskTitle">
          Title
        </label>
        <input
          id="taskTitle"
          className="text-input"
          placeholder="Enter the title"
          value={title}
          maxLength={TITLE_MAX}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched(true)}
          autoFocus
          aria-invalid={!titleValid && touched}
          aria-required="true"
        />
      </div>

      <div className="field-group">
        <label className="visually-hidden" htmlFor="taskDescription">
          Description
        </label>
        <textarea
          id="taskDescription"
          className="text-area"
          placeholder="Enter the description"
          rows={4}
          value={description}
          maxLength={DESC_MAX}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {!isAdd && (
        <div className="field-group status-select-wrapper">
          <label className="visually-hidden" id="statusLabel">
            Status
          </label>
          <button
            ref={triggerRef}
            type="button"
            aria-labelledby="statusLabel"
            className="status-trigger"
            onClick={() => setStatusOpen((o) => !o)}
            aria-expanded={statusOpen}
            aria-haspopup="listbox"
          >
            <span className="status-dot" data-status={status} />
            {status === TaskStatus.PENDING && "Pending"}
            {status === TaskStatus.IN_PROGRESS && "In Progress"}
            {status === TaskStatus.COMPLETED && "Completed"}
            <span className="caret" aria-hidden>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>
          {statusOpen && (
            <ul
              className="status-menu"
              role="listbox"
              aria-label="Select status"
              ref={menuRef}
              onKeyDown={onKeyDownStatus}
              tabIndex={-1}
            >
              {statusOptions.map((st, idx) => {
                const active = idx === activeStatusIndex;
                const selected = st === status;
                return (
                  <li key={st}>
                    <button
                      type="button"
                      className={`status-option ${selected ? "active" : ""}`}
                      role="option"
                      aria-selected={selected}
                      data-active={active || undefined}
                      onMouseEnter={() => setActiveStatusIndex(idx)}
                      onClick={() => {
                        setStatus(st);
                        closeStatus();
                        triggerRef.current?.focus();
                      }}
                    >
                      <span className="status-dot" data-status={st} />
                      {st === TaskStatus.PENDING && "Pending"}
                      {st === TaskStatus.IN_PROGRESS && "In Progress"}
                      {st === TaskStatus.COMPLETED && "Completed"}
                      {selected && (
                        <span className="check" aria-hidden>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
      <div className="form-actions">
        <button type="button" className="btn secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn primary" disabled={!titleValid}>
          {submitLabel || (mode === "add" ? "ADD" : "Update")}
        </button>
      </div>
    </form>
  );
};

export default EditTask;
