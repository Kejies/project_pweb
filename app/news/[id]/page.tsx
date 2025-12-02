"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/Components/Navbar";

type Post = {
  id: string;
  title: string;
  author: string;
  created_at: string;
  thumbnail: string;
  content: string;
};

export default function News() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/postById/${id}`, { cache: "no-store" })
      .then(r => r.json())
      .then(setPost)
      .catch(console.error);
  }, [id]);
  if (!post) return <p className="mt-20 px-6">Loading...</p>;

  const formatted = new Date(post.created_at).toLocaleString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
  <>
    <Navbar/>
    <article className="mt-24 max-w-3xl mx-auto px-4 space-y-4">
      <h1 className="text-3xl font-bold text-black">{post.title}</h1>

      <div className="text-gray-700 text-sm flex gap-4">
        <span>Penulis: {post.author}</span>
        <span>{formatted} WIB</span>
      </div>

      <Image
        src={post.thumbnail}
        width={900}
        height={500}
        alt={post.title}
        className="rounded-lg w-full object-cover"
        />

      <div className="mt-6 text-lg leading-relaxed text-black space-y-4">
        {post.content
          .split("\n")
          .map((para: string, idx: number) => (
            <p key={idx} className="text-justify ">
              {para.trim()}
            </p>
          ))}
      </div>

    </article>
          </>
  );
}
