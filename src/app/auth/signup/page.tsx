"use client";

import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";

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

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Account registered. Please proceed to sign-in.");
        setIsLoading(false);
      } else {
        router.push("/feed");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred during registration.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050507] p-4 relative selection:bg-white/20">
      <div className="fixed inset-0 tech-grid opacity-30 pointer-events-none z-0" />

      <div className="w-full max-w-sm relative z-10">
        <div className="linear-panel rounded-xl p-6 sm:p-7 shadow-2xl border border-zinc-800 space-y-5">
          <div className="space-y-1.5">
            <Link
              href="/"
              className="inline-flex w-7 h-7 rounded-md bg-white items-center justify-center text-black font-bold text-xs mb-1"
            >
              S
            </Link>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-zinc-400">
              Join the real-time social network built for modern engineers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="relative">
              <User
                size={14}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full linear-input rounded-md py-2 pl-9 pr-3 text-xs text-white placeholder:text-zinc-500 outline-none"
              />
            </div>

            <div className="relative">
              <Mail
                size={14}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full linear-input rounded-md py-2 pl-9 pr-3 text-xs text-white placeholder:text-zinc-500 outline-none"
              />
            </div>

            <div className="relative">
              <Lock
                size={14}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="password"
                placeholder="Password (minimum 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full linear-input rounded-md py-2 pl-9 pr-3 text-xs text-white placeholder:text-zinc-500 outline-none"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-mono">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 rounded-md bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors disabled:opacity-40"
            >
              {isLoading ? "Creating..." : "Initialize Account &rarr;"}
            </button>
          </form>

          <p className="text-xs text-zinc-500 text-center font-mono">
            Existing node?{" "}
            <Link
              href="/auth/signin"
              className="text-white hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
