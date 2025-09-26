import React, { useState } from 'react';

interface AddTaskFormProps {
  onAdd: (title: string) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Add a new task"
        className="add-task-input"
      />
      <button type="submit" className="add-task-button">Add</button>
    </form>
  );
};

export default AddTaskForm;
