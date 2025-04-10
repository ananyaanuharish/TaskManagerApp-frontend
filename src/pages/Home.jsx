import { motion } from "framer-motion";
import { useEffect } from "react";
import { FaLaptopCode, FaRegCopyright, FaRocket } from "react-icons/fa";

function Home() {
  useEffect(() => {
    document.title = "Home | Task Manager App";
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.25,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-300 via-pink-200 to-violet-200 px-6 py-12">
      {/* Animated background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob" />
      <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000" />

      {/* Floating Icons */}
      <motion.div
        className="absolute top-12 left-12 text-purple-800 text-5xl opacity-30"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        <FaLaptopCode />
      </motion.div>
      <motion.div
        className="absolute bottom-12 right-12 text-purple-800 text-5xl opacity-30"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <FaRocket />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center p-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-extrabold text-violet-700 mb-4"
          variants={itemVariants}
        >
          Welcome to Task Manager App📝
        </motion.h1>
        <motion.p
          className="text-lg text-gray-700 font-medium"
          variants={itemVariants}
        >
          A powerful productivity app built with ❤️ by{" "}
          <span className="font-bold text-pink-600">ANANYA A H</span>, a
          passionate Fullstack Web Developer🚀.
        </motion.p>
        <motion.div
          className="mt-6 flex justify-center items-center text-gray-500 text-sm gap-2"
          variants={itemVariants}
        >
          <FaRegCopyright />
          <span>{new Date().getFullYear()} ANANYA A H. All rights reserved.</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
