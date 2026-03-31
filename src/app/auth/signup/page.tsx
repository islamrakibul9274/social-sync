"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // Automatically sign in the user after successful registration
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Registration successful, but login failed. Please go to the sign-in page.");
        setIsLoading(false);
      } else {
        router.push("/feed");
      }
    } catch (err: any) {
      // This digs into the Axios error object to pull out the actual string message
      setError(err.response?.data?.error || "An error occurred during signup.");
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black cyber-mesh-background p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <motion.div
              className="inline-block mb-4"
              animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
            >
              <Zap className="text-indigo-400" size={48} />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Create Your Account</h1>
            <p className="text-gray-400 mt-2">Join the next generation of social.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="relative">
              <User className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <Mail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <Lock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-white/5 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </motion.div>

            {error && (
              <p className="text-sm text-rose-400 text-center">{error}</p>
            )}

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-all duration-300 shadow-lg glowing-cta-button"
              >
                {isLoading ? "Creating..." : "Sign Up"}
              </button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="text-center text-sm text-gray-400 mt-8">
            Already have an account?{" "}
            <a href="/auth/signin" className="font-medium text-indigo-400 hover:text-indigo-300">
              Sign In
            </a>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
