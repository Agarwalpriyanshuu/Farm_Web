import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
    return (
      <div className="min-h-screen pt-28 text-center text-gray-500">
        Loading blog...
      </div>
    );
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
    <div className="-mt-20">
    <div className="min-h-screen bg-[#EEF3EA] text-[#1B4332] pt-28 px-6">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/blogs")}
        className="fixed top-24 left-6 bg-white border border-green-200 px-4 py-2 rounded-lg shadow hover:bg-green-50 transition z-10"
      >
        ← Blogs
      </button>

      {/* 🖼️ CAROUSEL */}
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto relative mb-10"
        >
          <img
            src={images[current]}
            onClick={() => setLightbox(true)}
            className="w-full max-h object-cover rounded-2xl cursor-pointer shadow-md"
          />

          {/* LEFT */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 px-3 py-2 rounded-full shadow hover:bg-white"
            >
              ◀
            </button>
          )}

          {/* RIGHT */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 px-3 py-2 rounded-full shadow hover:bg-white"
            >
              ▶
            </button>
          )}

          {/* COUNTER */}
          <div className="text-center mt-3 text-gray-500 text-sm">
            {current + 1} / {images.length}
          </div>
        </motion.div>
      )}

      {/* 📄 CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto p-8 rounded-2xl shadow-sm border border-green-50"
      >

        {/* TITLE */}
        <h1 className="text-5xl font-bold leading-tight">
          {blog.title}
        </h1>

        {/* META */}
        <p className="text-gray-500 mt-3 text-sm">
          {new Date(blog.created_at).toDateString()} •{" "}
          {Math.ceil(blog.content.length / 500)} min read
        </p>

        {/* TAGS */}
        {blog.tags && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blog.tags.split(",").map((tag, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* CONTENT TEXT (FIXED VISIBILITY) */}
        <div className="mt-8 text-2g leading-relaxed whitespace-pre-line text-[#1B4332]">
          {blog.content}
        </div>

      </motion.div>

      {/* 🔥 LIGHTBOX */}
      {lightbox && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">

          <img
            src={images[current]}
            className="max-h-[90vh] max-w-[90vw] rounded-lg"
          />

          <button
            className="absolute top-6 right-6 text-white text-2xl"
            onClick={() => setLightbox(false)}
          >
            ✕
          </button>

          {/* NAV INSIDE LIGHTBOX */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 text-white text-2xl"
              >
                ◀
              </button>

              <button
                onClick={nextImage}
                className="absolute right-6 text-white text-2xl"
              >
                ▶
              </button>
            </>
          )}

        </div>
      )}
    </div>
    </div>
  );
}