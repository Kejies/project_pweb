"use client";
import Navbar from "@/Components/Navbar";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";

export default function postEdit() {
  const { id } = useParams();
  const router = useRouter()
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [userId, setId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
    if (!id) return;

    const getPost = async () => {
        try {
        const res = await fetch(`/api/postById/${id}`, { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
            console.error("Error fetch:", data);
            return;
        }
        console.log(data)
        setTitle(data.title || "");
        setContent(data.content || "");
        setName(data.author || "");
        setId(data.user_id || "");
        setPreviewUrl(data.thumbnail || null);
        } catch (err) {
        console.error("Fetch error:", err);
        }
    };

    getPost();
    }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f && f.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  };

async function uploadThumbnail(file: File, userId: any) {
  const ext = file.name.split('.').pop();
  const fileName = `posts/thumb-${userId}-${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("foto")
    .upload(fileName, file);

  if (upErr) throw upErr;

  const { data: urlData } = supabase.storage
    .from("foto")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title dan content harus diisi.");
      return;
    }
    try {
    let thumbnailUrl = null;

    if (file) {
        thumbnailUrl = await uploadThumbnail(file, userId);
    } else {
        thumbnailUrl = previewUrl;
    }

    const res = await fetch("/api/editPostById", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        id: id,      
        title,
        content,
        user_id: userId,
        author: name,
        thumbnail: thumbnailUrl,
        }),
    });
    const json = await res.json();

    if (!res.ok) {
        alert(json.error);
        return;
    }

    alert("Berita berhasil diupdate!");
    router.push("/");

    } catch (err) {
    console.error(err);
    }

  };

  return (
    <>
      <Navbar />
      <div className="mt-24 max-w-3xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium">
              Title
            </label>
            <input
              id="post-title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full bg-gray-900 text-gray-200 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none"
              placeholder="Masukkan judul..."
              required
            />
          </div>

          <div>
            <label htmlFor="post-content" className="block text-sm font-medium">
              Content
            </label>
            <textarea
              id="post-content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="mt-2 w-full bg-gray-900 text-gray-200 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none resize-vertical"
              placeholder="Tulis isi berita..."
              required
            />
          </div>

          <div>
            <label htmlFor="post-file" className="block text-sm font-medium">
              Thumbnail
            </label>
            <input
              ref={fileInputRef}
              id="post-file"
              name="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-gray-400"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="mt-3 w-48 h-32 object-cover rounded-md border"
              />
            )}
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
