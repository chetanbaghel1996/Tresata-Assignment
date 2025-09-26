import React, { useState } from "react";
import type { TaskStatus } from "../types";
import { TaskStatus as StatusConst } from "../types";
import { FormInput, FormTextArea, FormButton, StatusSelect } from "./ui";

interface AddEditTaskFormProps {
  mode: "add" | "edit";
  initial?: { title?: string; description?: string; status?: TaskStatus };
  onSubmit: (data: {
    title: string;
    description: string;
    status: TaskStatus;
  }) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const TITLE_MAX = 120;
const DESC_MAX = 500;

const AddEditTaskForm: React.FC<AddEditTaskFormProps> = ({
  mode,
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  const isAdd = mode === "add";
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [status, setStatus] = useState<TaskStatus>(
    initial?.status || StatusConst.PENDING
  );
  const [touched, setTouched] = useState(false);

  const titleValid = title.trim().length > 0;
  const titleError = touched && !titleValid ? "Title is required" : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!titleValid) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status: isAdd ? StatusConst.PENDING : status,
    });
  };

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
      aria-label={isAdd ? "Add Task Form" : "Edit Task Form"}
    >
      <FormInput
        id="taskTitle"
        label="Title"
        hideLabel
        placeholder="Enter the title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => setTouched(true)}
        maxLength={TITLE_MAX}
        showCounter
        error={titleError}
        autoFocus
        required
        aria-required="true"
      />

      <FormTextArea
        id="taskDescription"
        label="Description"
        hideLabel
        placeholder="Enter the description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={DESC_MAX}
        showCounter
        rows={4}
      />

      {!isAdd && (
        <StatusSelect
          value={status}
          onChange={setStatus}
          label="Status"
          hideLabel
        />
      )}

      <div className="form-actions">
        <FormButton type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </FormButton>
        <FormButton type="submit" variant="primary" disabled={!titleValid}>
          {submitLabel || (mode === "add" ? "ADD" : "Update")}
        </FormButton>
      </div>
    </form>
  );
};

export default AddEditTaskForm;
