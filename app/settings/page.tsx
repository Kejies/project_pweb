"use client";
import Link from "next/link";
import Navbar from "@/Components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/Auth/Verify")
      .then((res) => res.json())
      .then(async (verify) => {
        if (verify.logged) {
          const u = await fetch("/api/users/getUserByEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: verify.user.email }),
          }).then((res) => res.json());

          setName(u.user?.name || "");
          setEmail(u.user?.email || "");
        }
      });
  }, []);

  async function updateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("nama wajib diisi.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/users/editUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Update user gagal. Coba lagi.");
        setPending(false);
        return;
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setPending(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/Auth/Logout", { method: "POST" });
    router.push("/");
  }

  return (
    <>
      <Navbar />
      <div className="grid place-items-center mt-24">
            <div className="flex gap-2 w-full h-6">
              <Link href="/settings" className="w-1/2 text-center bg-[#2E86DE] text-white rounded-xl font-semibold">
                Users
              </Link>
              <Link href="/settings/postingan" className="w-1/2 text-center text-black font-semibold">
                Postingan
              </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-1/10 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition"
            >
              Logout
            </button>
            </div>
        <div className="flex mt-20 ">
          <form onSubmit={updateUser} className="space-y-5 w-fulls">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-black">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full bg-gray-900 text-gray-200 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black">Email</label>
              <input
                type="text"
                value={email || ""}
                disabled
                className="mt-2 w-full bg-gray-800 text-gray-400 border border-gray-600 rounded-lg p-3"
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
              {pending ? "Updating..." : "Update"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}
