import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import { FaUserPlus, FaEnvelope, FaLock } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/register", formData);
      console.log("✅ Registration success:", res.data);
      setMessage("✅ Registered successfully!");

      setTimeout(() => {
        setMessage("");
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data || err.message);
      setMessage("❌ Registration failed. Try again.");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-[90vh] bg-gradient-to-tr from-violet-900 via-pink-900 to-purple-800 overflow-hidden">
      {/* Floating emojis */}
      <motion.div
        className="absolute top-10 left-10 text-5xl opacity-30 pointer-events-none"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        🌸
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 text-5xl opacity-30 pointer-events-none"
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        💫
      </motion.div>
      <motion.div
        className="absolute top-20 right-20 text-4xl opacity-20 pointer-events-none"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      >
        🪄
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-5 border border-white/20 text-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-extrabold text-center text-pink-300 flex items-center justify-center gap-2">
          <FaUserPlus />
          Register
        </h2>

        <div className="flex items-center border border-pink-400/50 bg-white/10 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-pink-300">
          <FaUserPlus className="text-pink-200 mr-2" />
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className="w-full bg-transparent outline-none text-white placeholder-pink-200"
            required
          />
        </div>

        <div className="flex items-center border border-pink-400/50 bg-white/10 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-pink-300">
          <FaEnvelope className="text-pink-200 mr-2" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            className="w-full bg-transparent outline-none text-white placeholder-pink-200"
            required
          />
        </div>

        <div className="flex items-center border border-pink-400/50 bg-white/10 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-pink-300">
          <FaLock className="text-pink-200 mr-2" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            className="w-full bg-transparent outline-none text-white placeholder-pink-200"
            required
          />
        </div>

        <motion.button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold shadow-lg transition-all duration-300"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
        >
          Register
        </motion.button>

        {message && (
          <p className="text-center text-sm text-pink-200 mt-2">{message}</p>
        )}
      </motion.form>
    </div>
  );
}

export default Register;
