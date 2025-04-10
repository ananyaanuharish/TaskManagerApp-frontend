import { useState } from "react";
import axios from "axios";

function CreateTask({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // Due date state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title,
          description,
          dueDate: dueDate || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onTaskCreated(res.data);
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🎤 Speech Recognition Handler
  const handleSpeech = (setState) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser 😢");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setState((prev) => (prev ? prev + " " + speechText : speechText));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md"
    >
      <h3 className="text-lg font-bold mb-4 text-purple-700">Create a Task</h3>

      {/* Title input + mic */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded pr-10"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => handleSpeech(setTitle)}
          className="absolute right-2 top-2 text-gray-500 hover:text-purple-700"
          title="Speak Title"
        >
          🎤
        </button>
      </div>

      {/* Description input + mic */}
      <div className="relative mb-3">
        <textarea
          placeholder="Description (optional)"
          className="w-full border p-2 rounded pr-10"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="button"
          onClick={() => handleSpeech(setDescription)}
          className="absolute right-2 top-2 text-gray-500 hover:text-purple-700"
          title="Speak Description"
        >
          🎤
        </button>
      </div>

      {/* Due Date input */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Due Date
      </label>
      <input
        type="date"
        className="w-full border p-2 rounded mb-3"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        disabled={loading}
      >
        {loading ? "Creating..." : "Add Task"}
      </button>
    </form>
  );
}

export default CreateTask;
