import React, { useState, useRef, useEffect } from "react";

interface CollapsibleSectionProps {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
  storageKey?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  count,
  defaultOpen = true,
  children,
  storageKey,
}) => {
  const key =
    storageKey || `section_${title.replace(/\s+/g, "_").toLowerCase()}`;
  const [open, setOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) return saved === "1";
    } catch (error) {
      void error;
      return defaultOpen;
    }
    return defaultOpen;
  });
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(key, open ? "1" : "0");
    } catch (error) {
      void error;
    }
  }, [open, key]);

  return (
    <section className={`collapsible ${open ? "open" : ""}`}>
      <button
        className="collapsible-head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={key + "_body"}
      >
        <div className="head-left">
          <p>{title}</p>
          <span className="count" aria-label={`${count} tasks`}>
            ({count})
          </span>
        </div>
        <span className="chevron" aria-hidden>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={"var(--c-brand)"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      <div
        id={key + "_body"}
        ref={bodyRef}
        className="collapsible-wrapper"
        style={{
          height: open ? bodyRef.current?.scrollHeight : 0,
          overflow: "hidden",
          transition: "height .35s ease",
        }}
        aria-hidden={!open}
      >
        <div className="collapsible-body">{children}</div>
      </div>
    </section>
  );
};

export default CollapsibleSection;
