## Task Manager (React + TypeScript + Vite)

A responsive task management application built in React + TypeScript following a Figma-inspired layout (grouped sections, blue brand bar, light theme). Users can add, edit, update status, search, and delete tasks. Tasks persist via Local Storage.

### Core Features
* Add new tasks (title, description, initial status)
* Edit existing tasks (change title, description, status)
* Status workflow: Pending → In Progress → Completed
* Grouped collapsible sections: In Progress, Pending, Completed
* Quick complete action icon on rows
* Search bar filters across title & description
* Local Storage persistence with migration from legacy boolean `completed`
* Accessible buttons & semantic status indicators

### UI / UX Highlights
* Two-mode layout: list panel + detail panel (Add/Edit)
* Lightweight status dropdown with custom dot indicators
* Compact row design with icon, status badge, description snippet, created date
* Collapsible sections with counts
* Light theme with subtle borders & shadows

### Tech Stack
* React + TypeScript (Vite)
* Custom hook `useTasks` encapsulates: state, persistence, filtering, search, status migration
* Plain CSS (no UI library) for full control and assessment clarity

### Project Structure (key files)
```
src/
  components/
    AddEditTaskForm.tsx
    CollapsibleSection.tsx
    PageHeader.tsx
    SearchBar.tsx
    StatusBadge.tsx
    TaskItem.tsx
    TaskList.tsx
  hooks/
    useTasks.ts
  types/
    index.ts
  App.tsx
  App.css
```

### Running Locally
Install dependencies and start the dev server:
```bash
npm install
npm run dev
```
Then open the shown local URL (usually http://localhost:5173).

To create a production build:
```bash
npm run build
npm run preview
```

### Design Decisions
* Central `useTasks` hook avoids prop drilling and isolates persistence/search/status logic.
* Introduced `TaskStatus` enum (pending | in_progress | completed) replacing legacy boolean while preserving backward compatibility.
* Grouped rendering done in `App` for clarity instead of nested conditionals inside list component.
* UI components are stateless where possible; form manages its own local controlled fields.
* Minimal global CSS with focused class names; easy theming by adjusting color tokens.
* Migrates and normalizes stored tasks defensively with type guards.

### Extensibility Ideas
* Drag & drop manual ordering within sections
* Virtualized list for very large task volumes
* Due dates, reminders & calendar integration
* Bulk actions (multi-select + batch status)
* Backend sync (REST / GraphQL) & optimistic reconciliation
* Vitest + React Testing Library coverage
* Theme system (CSS variables: dark theme reintroduction)
* Sorting controls (recent, alpha, status)

### Edge Cases & Safeguards
* Empty or whitespace-only titles ignored
* Legacy tasks without status auto-mapped using old `completed` boolean
* Defensive parsing of Local Storage with try/catch and shape normalization
* Search applied after status grouping so empty groups collapse gracefully
* Safe date fallback if stored timestamps are missing

### Accessibility Notes
* Icon buttons include `aria-label` attributes
* Status represented by both text & colored dot (non-color dependent)
* Form fields labeled via placeholders + structural semantics; could be enhanced with explicit `<label>` tags in future
* Keyboard friendly: Enter submits, Escape can rely on navigation/back (future enhancement: add explicit cancel key binding)

### License
This codebase is for assessment/demo purposes. Adapt freely as needed.

---
Feel free to extend functionality—`useTasks` is the main integration point for advanced behaviors.
