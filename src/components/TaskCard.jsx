// src/components/TaskCard.jsx
import { FaTrash, FaEdit, FaRegClock } from "react-icons/fa";

const TaskCard = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  loading,
}) => {
  const dueDateFormatted = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <li
      className={`p-5 rounded-2xl shadow-md border-l-8 relative overflow-hidden transition-all duration-300 bg-white ${
        task.completed ? "border-green-400" : "border-red-400"
      } before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:blur-lg before:opacity-20 before:bg-gradient-to-br before:from-pink-300 before:to-purple-400`}
    >
      <div>
        <h4 className="font-bold text-lg text-purple-800">{task.title}</h4>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Created: {new Date(task.createdAt).toLocaleString()}
        </p>

        {dueDateFormatted && (
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-500 text-xs font-semibold rounded-full border border-red-200 shadow-sm">
            <FaRegClock className="text-xs" />
            Due: {dueDateFormatted}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 mt-4">
        <button
          disabled={loading}
          onClick={() => onToggleComplete(task._id, task.completed)}
          className={`text-white text-sm px-3 py-1 rounded-md transition-transform duration-200 transform hover:scale-105 ${
            task.completed ? "bg-yellow-500" : "bg-green-600"
          } disabled:opacity-50`}
        >
          {task.completed ? "Mark as Incomplete" : "Mark as Done"}
        </button>

        {task.completed && (
          <span className="text-green-600 text-sm font-medium">
            ✔ Completed
          </span>
        )}

        <button
          disabled={loading}
          onClick={() => onDelete(task)}
          className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1 transition"
        >
          <FaTrash className="text-xs" />
          Delete
        </button>

        <button
          onClick={() => onEdit(task)}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 transition"
        >
          <FaEdit className="text-xs" />
          Edit
        </button>
      </div>
    </li>
  );
};

export default TaskCard;
