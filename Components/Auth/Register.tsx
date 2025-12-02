"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirm, setConfirm] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [pending, setPending] = useState<boolean>(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        if (!name || !email || !password) {
            setError("Email dan password wajib diisi.");
            return;
        }
        if (password !== confirm) {
            setError("Password dan konfirmasi tidak cocok.");
            return;
        }

        setPending(true);
        try {
            const res = await fetch("/api/Auth/Register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data?.message || "Registrasi gagal. Coba lagi.");
                setPending(false);
                return;
            }

            router.push("/login");
        } catch (err) {
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
                            className="w-1/2 text-center py-2 rounded-xl hover:bg-gray-600 transition"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="w-1/2 text-center py-2 rounded-xl bg-gray-900 text-white font-medium"
                            aria-current="page"
                        >
                            Register
                        </Link>
                    </div>

                    <div>
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <input type="text" name="name" id="name" required value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setName(e.target.value)
                        }
                            className="mt-2 w-full bg-gray-900 text-gray-200 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none"
                            placeholder="Your Name"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setEmail(e.target.value)
                            }
                            className="mt-2 w-full bg-gray-900 text-gray-200 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setPassword(e.target.value)
                            }
                            className="mt-2 w-full bg-gray-900 text-gray-200 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none"
                            placeholder="••••••"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm" className="text-sm font-medium">
                            Confirm Password
                        </label>
                        <input
                            id="confirm"
                            name="confirm"
                            type="password"
                            required
                            value={confirm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setConfirm(e.target.value)
                            }
                            className="mt-2 w-full bg-gray-900 text-gray-200 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none"
                            placeholder="••••••"
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
                        {pending ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
}
