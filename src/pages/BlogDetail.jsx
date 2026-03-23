import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, []);

  async function fetchBlog() {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single();

    setBlog(data);
  }

  if (!blog) {
    return <p className="pt-28 text-center text-gray-400">Loading...</p>;
  }

  const images =
    blog.images?.length > 0
      ? blog.images
      : blog.image_url
      ? [blog.image_url]
      : [];

  function nextImage() {
    setCurrent((prev) => (prev + 1) % images.length);
  }

  function prevImage() {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* 🔙 Back */}
      <button
        onClick={() => navigate("/blogs")}
        className="fixed top-24 left-6 bg-black/50 px-4 py-2 rounded-lg text-green-400"
      >
        ← Blogs
      </button>

      {/* 🖼️ CAROUSEL */}
      {images.length > 0 && (
        <div className="max-w-5xl mx-auto mt-24 px-6 relative">

          <img
            src={images[current]}
            onClick={() => setLightbox(true)}
            className="w-full max-h-[400px] object-cover rounded-2xl cursor-pointer"
          />

          {/* LEFT */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-8 top-1/2 -translate-y-1/2 bg-black/50 px-3 py-2 rounded"
            >
              ◀
            </button>
          )}

          {/* RIGHT */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-8 top-1/2 -translate-y-1/2 bg-black/50 px-3 py-2 rounded"
            >
              ▶
            </button>
          )}

          {/* COUNTER */}
          <div className="text-center mt-2 text-gray-400 text-sm">
            {current + 1} / {images.length}
          </div>

        </div>
      )}

      {/* 📄 CONTENT */}
      <div className="max-w-3xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold">{blog.title}</h1>

        <p className="text-gray-400 mt-2">
          {new Date(blog.created_at).toDateString()} •{" "}
          {Math.ceil(blog.content.length / 500)} min read
        </p>

        {/* TAGS */}
        {blog.tags && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blog.tags.split(",").map((tag, i) => (
              <span
                key={i}
                className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 text-lg leading-relaxed whitespace-pre-line text-gray-200">
          {blog.content}
        </div>

      </div>

      {/* 🔥 LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setLightbox(false)}
        >

          <img
            src={images[current]}
            className="max-h-[90vh] max-w-[90vw] rounded-lg"
          />

          <button
            className="absolute top-6 right-6 text-white text-xl"
            onClick={() => setLightbox(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}