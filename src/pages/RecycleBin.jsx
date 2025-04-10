import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const RecycleBin = () => {
  const [deletedTasks, setDeletedTasks] = useState([]);

  const fetchDeletedTasks = async () => {
    try {
      const res = await API.get("/tasks/deleted");
      setDeletedTasks(res.data);
    } catch (err) {
      toast.error("Failed to fetch deleted tasks");
    }
  };

  const handleRestore = async (taskId) => {
    try {
      await API.put(`/tasks/restore/${taskId}`);
      toast.success("Task restored successfully");
      fetchDeletedTasks(); // Refresh the list
    } catch (err) {
      toast.error("Failed to restore task");
    }
  };

  useEffect(() => {
    fetchDeletedTasks();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-700 via-purple-700 to-violet-900">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl text-white"
      >
        <h2 className="text-2xl font-bold text-center mb-4">🗑️ Recycle Bin</h2>
        {deletedTasks.length === 0 ? (
          <p className="text-center text-gray-200">No deleted tasks found.</p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-transparent">
            {deletedTasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white/20 border border-white/30 rounded-lg p-4 shadow"
              >
                <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                <p className="text-white/80">{task.description}</p>
                <p className="text-sm text-gray-300 mt-1">
                  Deleted on: {new Date(task.deletedAt).toLocaleString()}
                </p>
                <button
                  onClick={() => handleRestore(task._id)}
                  className="mt-3 px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded shadow"
                >
                  Restore
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RecycleBin;
