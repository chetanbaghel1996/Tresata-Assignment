import { Routes, Route } from "react-router-dom";
import TaskList from "./pages/TaskListPage";
import EditTask from "./pages/EditTask";
import { Layout } from "./templates/layout";

export const Navigation = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout children={<TaskList />} title="TO-DO APP" showBack={false} />
        }
      />
      <Route
        path="/add"
        element={
          <Layout
            children={<EditTask mode="add" />}
            title="Add Task"
            showBack={true}
          />
        }
      />
      <Route
        path="/edit/:id"
        element={
          <Layout
            children={<EditTask mode="edit" />}
            title="Edit Task"
            showBack={true}
          />
        }
      />
    </Routes>
  );
};

export default Navigation;
