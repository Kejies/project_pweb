"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    try {
      const res = await fetch("/api/Auth/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Login gagal");
        setPending(false);
        return;
      }

      router.push("/");
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid place-items-center min-h-screen text-gray-200 px-4">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex bg-gray-700 p-1 rounded-xl">
            <Link
              href="/login"
              className="w-1/2 text-center py-2 rounded-xl bg-gray-900 text-white font-medium"
              aria-current="page"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="w-1/2 text-center py-2 rounded-xl hover:bg-gray-600 transition"
            >
              Register
            </Link>
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-2 w-full bg-gray-900 text-gray-200 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-2 w-full bg-gray-900 text-gray-200 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-500 p-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 disabled:opacity-50 rounded-lg py-3 font-semibold transition"
          >
            {pending ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
