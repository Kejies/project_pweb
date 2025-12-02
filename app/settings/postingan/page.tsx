"use client";
import Link from "next/link";
import Navbar from "@/Components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash, Pen } from "lucide-react";
import Image from "next/image";

type NewsItem = {
  id: number;           // ubah ke number jika DB int8
  title: string;
  author: string;
  created_at: string;
  thumbnail: string;
};

export default function Postingans() {
  const router = useRouter();
  const [getData, setData] = useState<NewsItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const resVerify = await fetch("/api/Auth/Verify");
        const verify = await resVerify.json();

        if (!verify?.logged) {
          console.warn("Not logged");
          return;
        }

        const res = await fetch("/api/getPostByAuthorId", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: verify.user.id }),
        });

        const data = await res.json();
        console.log("RAW DATA:", data);
        setData(data.post ?? []);  
      } catch (err) {
        console.error("Failed fetching posts:", err);
        setData([]);
      }
    })();
  }, []);
  
  const editNews = async(newsId: number) => {
    if(newsId === undefined || newsId === null) {
      console.log("Invalid Id for Edit", newsId);
      return;
    }
    try{
      const res = await fetch("/api/editPostById", {
        method: "POST",
      })
    }catch (err) {
      console.log("failed to edit", err)
    }
  }
  const deleteNews = async (newsId: number) => {
    if (newsId === undefined || newsId === null) {
      console.error("Invalid Id for delete:", newsId);
      return;
    }

    try {
      const res = await fetch("/api/deletePostById", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: newsId }),
      });
      const json = await res.json();
      console.log("delete response:", json);
      setData(prev => prev.filter(item => item.id !== newsId));
      alert("Berita berhasil dihapus!");
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = (now.getTime() - date.getTime()) / 1000;
    const minute = 60, hour = 3600, day = 86400;
    if (diff < minute) return "Baru saja";
    if (diff < hour) return `${Math.floor(diff / minute)} menit yang lalu`;
    if (diff < day) return `${Math.floor(diff / hour)} jam yang lalu`;
    if (diff < day * 7) return `${Math.floor(diff / day)} hari yang lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  }

  return (
    <>
      <Navbar />
      <div className="grid mt-24 px-4">
        <div className="flex gap-2 w-full h-6">
          <Link href="/settings" className="w-1/2 text-center text-black font-semibold">Users</Link>
          <Link href="/settings/postingan" className="w-1/2 text-center bg-[#2E86DE] text-white rounded-xl font-semibold">Postingan</Link>
          <Link href="/settings" className="w-1/10 text-center bg-red-500 font-semibold">Logout</Link>
        </div>

        <div className="mt-20 space-y-6">
          {(getData?.length ?? 0) > 0 ? (
            getData.map(data => (
              <article key={data.id} className="flex gap-6 items-start transition">
                <Link href={`/news/${data.id}`} className="block shrink-0 w-[120px] md:w-[180px] rounded-lg overflow-hidden">
                  <Image src={data.thumbnail} width={360} height={240} alt={data.title} className="object-cover w-full h-32 md:h-[110px] lg:h-[120px]" />
                </Link>

                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold leading-snug mb-2 text-black">
                    <Link href={`/news/${data.id}`}>{data.title}</Link>
                  </h3>
                  <span className="text-sm text-gray-700">Penulis : {data.author}</span>
                  <div className="text-sm text-gray-500">{timeAgo(data.created_at)}</div>
                </div>

                <Link className="bg-yellow-500 p-2 my-auto h-full hover:opacity-90 rounded-md" href={`/post-edit/${data.id}`}><Pen/></Link>
                <button className="bg-red-500 p-2 my-auto h-full hover:opacity-90 rounded-md" onClick={() => deleteNews(data.id)}><Trash/></button>
              </article>
            ))
          ) : (
            <p className="text-center text-gray-500 w-full">Belum ada berita yang kamu posting.</p>
          )}
        </div>
      </div>
    </>
  );
}
