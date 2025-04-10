import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Laptop } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      const res = await axios.post("http://localhost:5000/api/login", formData);
      localStorage.setItem("token", res.data.token);
      setMessage("✅ Logged in successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setMessage("❌ Login failed. Check credentials.");
    }
  };

  useEffect(() => {
    document.title = "Login | Task Manager";
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-300 via-pink-200 to-violet-200">
      {/* Animated background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob" />
      <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000" />

      {/* Rocket icon top-left */}
      <motion.div
        className="absolute top-6 left-6 text-purple-800"
        initial={{ opacity: 0, y: -10, rotate: -20 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 0.4, type: "spring" }}
      >
        <Rocket size={32} className="animate-pulse" />
      </motion.div>

      {/* Laptop icon top-right */}
      <motion.div
        className="absolute top-6 right-6 text-purple-800"
        initial={{ opacity: 0, y: -10, rotate: 20 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <Laptop size={32} className="animate-bounce" />
      </motion.div>

      {/* Login form box */}
      <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-5"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          className="text-3xl font-extrabold text-center text-purple-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Login
        </motion.h2>

        <motion.input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          className="w-full border border-purple-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        />

        <motion.input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className="w-full border border-purple-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        />

        <motion.button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Login
        </motion.button>

        {message && (
          <motion.p
            className="text-center text-sm mt-2 text-purple-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {message}
          </motion.p>
        )}
      </motion.form>
    </div>
  );
}

export default Login;
