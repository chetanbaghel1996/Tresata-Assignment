import React, { useRef, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search To-Do' }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        if (value) {
          onChange('');
        } else {
          (document.activeElement as HTMLElement).blur();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [value, onChange]);

  return (
    <div className="search-bar" role="search" aria-label="Search tasks">
      <span className="icon" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        aria-label="Search tasks"
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          className="icon-btn small clear-btn"
          onClick={() => onChange('')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
