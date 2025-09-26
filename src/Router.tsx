import { Routes, Route } from "react-router-dom";
import TaskList from "./pages/TaskListPage";
import EditTask from "./pages/EditTask";

export const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<TaskList />} />
      <Route path="/add" element={<EditTask mode="add" />} />
      <Route path="/edit/:id" element={<EditTask mode="edit" />} />
    </Routes>
  );
};

export default Navigation;
