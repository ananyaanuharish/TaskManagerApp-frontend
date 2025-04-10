import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import CreateTask from "../components/CreateTask";
import EditTask from "../components/EditTask";
import { FaTrash, FaEdit } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deletedTask, setDeletedTask] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const navigate = useNavigate();
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser({ name: decoded.name });
      fetchTasks(token);
    } catch (error) {
      console.error("Token decode failed:", error);
      navigate("/login");
    }
  }, [navigate]);

  const fetchTasks = async (token = getToken()) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      setActionInProgress(true);
      const token = getToken();
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks(token);
      toast.success(`Marked as ${!currentStatus ? "done" : "incomplete"}`);
    } catch (error) {
      console.error("Toggle task failed:", error);
      toast.error("Failed to update task status");
    } finally {
      setActionInProgress(false);
    }
  };

  const confirmDeleteTask = (task) => {
    setTaskToDelete(task);
  };

  const handleDeleteConfirmed = async () => {
    const token = getToken();
    try {
      setActionInProgress(true);
      await axios.delete(`http://localhost:5000/api/tasks/${taskToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((task) => task._id !== taskToDelete._id));
      setDeletedTask({ ...taskToDelete });

      toast.success(
        (t) => (
          <span>
            Task deleted.
            <button
              onClick={() => undoDeleteTask(taskToDelete)}
              className="ml-2 text-blue-600 underline"
            >
              Undo
            </button>
          </span>
        ),
        { duration: 5000 }
      );
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Delete failed");
    } finally {
      setTaskToDelete(null);
      setActionInProgress(false);
    }
  };

  const undoDeleteTask = async (task) => {
    try {
      const token = getToken();
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title: task.title,
          description: task.description,
          completed: task.completed,
          dueDate: task.dueDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks((prev) => [res.data, ...prev]);
      setDeletedTask(null);
      toast.success("Task restored");
    } catch (error) {
      console.error("Undo restore failed", error);
      toast.error("Failed to restore task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "incomplete") return !task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sortedTasks = [...filteredTasks];
  if (sortOption === "newest") {
    sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOption === "oldest") {
    sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortOption === "az") {
    sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "za") {
    sortedTasks.sort((a, b) => b.title.localeCompare(a.title));
  }

  return (
    <div className="relative overflow-hidden min-h-screen px-6 py-10 bg-gradient-to-br from-pink-50 to-purple-100">
      {/* 🌈 Background Animation */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
        animate={{ x: [0, 100, 0], y: [0, -100, 0], rotate: [0, 360, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
        animate={{ x: [0, -100, 0], y: [0, 100, 0], rotate: [0, 360, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
      />

      <Toaster />
      <div className="max-w-4xl mx-auto relative z-10">

        <motion.h2
          initial={{ y: -40, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 10 }}
          className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-bounce"
        >
          Hey {user?.name}, Welcome ⭐
        </motion.h2>

        <p className="text-gray-600 mb-6">Here are your tasks:</p>

        {/* Create Task */}
        <div className="relative p-1 rounded-2xl bg-gradient-to-r from-purple-300/30 to-pink-300/30 mb-6 hover:opacity-100 transition-opacity duration-300 before:absolute before:inset-0 before:rounded-2xl before:border-[2px] before:border-transparent hover:before:border-pink-400 hover:before:opacity-100 before:transition before:duration-300">
          <div className="relative z-10 rounded-2xl bg-white p-4 shadow-md">
            <CreateTask
              onTaskCreated={(newTask) => {
                setTasks((prev) => [newTask, ...prev]);
                toast.success("Task created successfully!");
              }}
            />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mt-6 mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full px-4 py-2 rounded-md border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-3 left-3 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {["all", "completed", "incomplete"].map((val) => (
            <button
              key={val}
              className={`px-4 py-2 rounded-full font-semibold border transition ${
                filter === val
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-purple-600 border-purple-300 hover:border-purple-600"
              }`}
              onClick={() => setFilter(val)}
            >
              {val === "all" && " All"}
              {val === "completed" && " Completed"}
              {val === "incomplete" && " Not Completed"}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="mb-6 text-right">
          <select
            className="border border-purple-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="newest">Date: Newest → Oldest</option>
            <option value="oldest">Date: Oldest → Newest</option>
            <option value="az">Title: A → Z</option>
            <option value="za">Title: Z → A</option>
          </select>
        </div>

        {/* Task List */}
        {loading ? (
          <p className="text-purple-600 text-center font-semibold animate-pulse">Loading tasks...</p>
        ) : sortedTasks.length === 0 ? (
          <p className="text-gray-500 text-center">
            No tasks found 😢 — try adjusting your filters or search!
          </p>
        ) : (
          <ul className="space-y-4">
            {sortedTasks.map((task) => (
              <li
                key={task._id}
                className={`p-4 rounded-2xl border relative overflow-hidden transition-all duration-300 ${
                  task.completed
                    ? "border-green-200 bg-white shadow-lg"
                    : "border-red-200 bg-white shadow-md"
                } before:absolute before:inset-0 before:rounded-2xl before:border-[2px] before:border-transparent before:bg-gradient-to-r before:from-purple-300/30 before:to-pink-300/30 before:opacity-0 hover:before:opacity-100 before:transition`}
              >
                <div className="relative z-10 flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-semibold text-lg text-purple-800">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-gray-500">{task.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </p>
                    {task.dueDate && (
                      <p className="text-xs mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-600 font-medium rounded-full text-xs border border-pink-200">
                          <BsCalendar2DateFill className="text-sm" />
                          Due:{" "}
                          {new Date(task.dueDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      disabled={actionInProgress}
                      onClick={() => handleToggleComplete(task._id, task.completed)}
                      className={`text-white text-sm px-3 py-1 rounded-lg transition-all duration-200 ${
                        task.completed
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-600 hover:bg-green-700"
                      } disabled:opacity-50`}
                    >
                      {task.completed ? "Mark as Incomplete" : "Mark as Done"}
                    </button>

                    {task.completed && (
                      <span className="text-green-500 text-sm">✔ Completed</span>
                    )}

                    <button
                      disabled={actionInProgress}
                      onClick={() => confirmDeleteTask(task)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1 transition"
                    >
                      <FaTrash className="text-xs" />
                      Delete
                    </button>

                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 transition"
                    >
                      <FaEdit className="text-xs" />
                      Edit
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleLogout}
          className="mt-10 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <EditTask
          task={editingTask}
          onCancel={() => setEditingTask(null)}
          onUpdate={(updatedTask) => {
            setTasks((prevTasks) =>
              prevTasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
            );
            setEditingTask(null);
            toast.success("Task updated successfully!");
          }}
        />
      )}

      {/* Confirm Delete Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this task?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
