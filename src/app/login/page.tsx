"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lock } from "lucide-react";
import { isAuthenticated, login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const success = login(username, password);
    if (success) {
      router.replace("/admin");
    } else {
      setError("Invalid username or password. Use admin/admin123.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-20 px-4 md:px-6 flex items-center justify-center">
      <div className="container mx-auto max-w-3xl">
        <GlassCard className="p-10">
          <div className="mb-8 text-center">
            <Lock className="mx-auto mb-4 h-12 w-12 text-brand-neon" />
            <h1 className="text-4xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400 mt-2">Sign in to manage contact submissions and exports.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="admin"
                className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white outline-none focus:border-brand-neon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="admin123"
                className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white outline-none focus:border-brand-neon"
              />
            </div>

            {error && <div className="text-sm text-red-400">{error}</div>}

            <AnimatedButton type="submit" variant="primary" className="w-full py-4" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </AnimatedButton>
          </form>

          <div className="mt-6 text-sm text-gray-400">
            Demo credentials: <span className="text-white">admin</span> / <span className="text-brand-neon">admin123</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
