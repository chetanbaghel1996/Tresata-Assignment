import { useNavigate } from "react-router-dom";
import PlusIcon from "../icons/PlusIcon";

const AddTaskButton = () => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="fab-add in-panel"
      aria-label="Add Task"
      onClick={() => {
        navigate("/add");
      }}
    >
      <PlusIcon />
    </button>
  );
};
export default AddTaskButton;
