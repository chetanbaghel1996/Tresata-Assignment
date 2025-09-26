import React, { useState, useRef, useEffect, useCallback } from "react";
import type { TaskStatus } from "../../types";
import { TaskStatus as StatusConst } from "../../types";

interface StatusSelectProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  label?: string;
  hideLabel?: boolean;
  disabled?: boolean;
}

const statusOptions: TaskStatus[] = [
  StatusConst.PENDING,
  StatusConst.IN_PROGRESS,
  StatusConst.COMPLETED,
];

const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case StatusConst.PENDING:
      return "Pending";
    case StatusConst.IN_PROGRESS:
      return "In Progress";
    case StatusConst.COMPLETED:
      return "Completed";
    default:
      return "Unknown";
  }
};

const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  label = "Status",
  hideLabel = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const menuRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(statusOptions.findIndex((option) => option === value));
    }
  }, [isOpen, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          closeMenu();
          triggerRef.current?.focus();
          break;
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((prev) =>
            prev < statusOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : statusOptions.length - 1
          );
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (activeIndex >= 0 && statusOptions[activeIndex]) {
            onChange(statusOptions[activeIndex]);
            closeMenu();
            triggerRef.current?.focus();
          }
          break;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, activeIndex, onChange, closeMenu]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (status: TaskStatus) => {
    onChange(status);
    closeMenu();
    triggerRef.current?.focus();
  };

  return (
    <div className="field-group status-select-wrapper">
      {label && (
        <label className={hideLabel ? "visually-hidden" : ""} id="statusLabel">
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        aria-labelledby="statusLabel"
        className="status-trigger"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
      >
        <span className="status-dot" data-status={value} />
        {getStatusLabel(value)}
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

      {isOpen && (
        <ul
          className="status-menu"
          role="listbox"
          aria-label="Select status"
          ref={menuRef}
          tabIndex={-1}
        >
          {statusOptions.map((status, idx) => {
            const active = idx === activeIndex;
            const selected = status === value;
            return (
              <li key={status}>
                <button
                  type="button"
                  className={`status-option ${selected ? "active" : ""}`}
                  role="option"
                  aria-selected={selected}
                  data-active={active || undefined}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handleOptionClick(status)}
                >
                  <span className="status-dot" data-status={status} />
                  {getStatusLabel(status)}
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
  );
};

export default StatusSelect;
