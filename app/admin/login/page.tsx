"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem("admin_token", data.token);
      toast.success("Welcome back!");
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      let message = "Invalid credentials";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        message = axiosErr.response?.data?.error || message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
            <Lock size={28} className="text-on-primary" />
          </div>
          <h1 className="font-display-lg text-display-lg-mobile text-primary mb-2">Admin</h1>
          <p className="font-body-md text-on-surface-variant">Sign in to manage your content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/20 shadow-xl">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body-md text-primary focus:border-electric-blue focus:ring-1 focus:ring-electric-blue focus:outline-none rounded-lg transition-all"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 px-4 py-3 font-body-md text-primary focus:border-electric-blue focus:ring-1 focus:ring-electric-blue focus:outline-none rounded-lg transition-all"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-4 font-label-sm text-label-sm uppercase tracking-widest hover:bg-electric-blue transition-all duration-300 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
