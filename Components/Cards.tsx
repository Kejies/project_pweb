"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type NewsItem = {
  id: string;
  title: string;
  author: string;
  created_at: string;
  thumbnail: string;
};
function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = (now.getTime() - date.getTime()) / 1000; // selisih dalam detik

  const minute = 60;
  const hour = 3600;
  const day = 86400;

  if (diff < minute) return "Baru saja";
  if (diff < hour) return `${Math.floor(diff / minute)} menit yang lalu`;
  if (diff < day) return `${Math.floor(diff / hour)} jam yang lalu`;
  if (diff < day * 7) return `${Math.floor(diff / day)} hari yang lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Cards() {
  const [getData, setData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/Posts");
        const data = await res.json();
        console.log("DATA DARI API:", data);
        setData(data);
      } catch (err) {
        console.error("Gagal fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="mt-28 md:mt-20 px-4 md:px-8 text-[#1A1A1A]">
      <h2 className="text-2xl font-semibold mb-4 text-left">News Feed</h2>

      {isLoading && <p>Loading...</p>}

      <div className="max-w-4xl mx-auto space-y-6">
        {getData.length > 0 ? (
          getData.map((data) => (
            <article key={data.id} className="flex gap-6 items-start hover:text-blue-400 transition">
              <Link
                href={`/news/${data.id}`}
                className="block shrink-0 w-[120px] md:w-[180px] rounded-lg overflow-hidden"
              >
                <Image
                  src={data.thumbnail}
                  width={360}
                  height={240}
                  alt={data.title}
                  className="object-cover w-full h-32 md:h-[110px] lg:h-[120px]"
                />
              </Link>

              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-semibold leading-snug mb-2">
                  <Link href={`/news/${data.id}`}>
                    {data.title}
                  </Link>
                </h3>
                <span className="text-sm text-gray-700">Penulis : {data.author}</span>
                <div className="text-sm text-gray-500">{timeAgo(data.created_at)}</div>
              </div>
            </article>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full">Tidak ada data tersedia.</p>
        )}
      </div>
    </section>
  );
}
