"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isLogin, setIsLogin] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/Auth/Verify", { method: "GET", credentials: "same-origin", cache: "no-store" });
        if (!mounted) return;
        if (res.ok) {
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      } catch (err) {
        console.error("auth check error", err);
        if (mounted) setIsLogin(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (isLogin === null) {
    return (
      <nav className="bg-[#2E86DE] p-4 fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white">Fresh<span className="text-[#D99A20]">News</span></Link>
          <div>Checking...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#0A2342] p-4 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wide hover:opacity-80 transition">Fresh<span className="text-[#D99A20]">News</span></Link>

        {isLogin ? (
          <div className="flex items-center gap-3">
            <Link href="/post-news" className="px-4 py-2 bg-[#2E86DE] hover:bg-[#1B64A5] rounded-lg">Post News</Link>
            <Link href="/settings" className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg">Settings</Link>
          </div>
        ) : (
          <Link href="/login" className="px-4 py-2 bg-[#F7B731] hover:bg-[#D99A20] rounded-lg">Login</Link>
        )}
      </div>
    </nav>
  );
}
