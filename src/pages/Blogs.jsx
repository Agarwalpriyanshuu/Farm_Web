import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
    getUser();
  }, []);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  async function fetchBlogs() {
    setLoading(true);

    const { data } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    setBlogs(data || []);
    setLoading(false);
  }

  function getFilePathFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split("/blog-images/");
      return parts[1];
    } catch {
      return null;
    }
  }

  async function deleteBlog(blog) {
    if (!window.confirm("Delete this blog?")) return;

    let paths = [];

    if (blog.images?.length) {
      blog.images.forEach((url) => {
        const path = getFilePathFromUrl(url);
        if (path) paths.push(path);
      });
    }

    if (blog.image_url) {
      const path = getFilePathFromUrl(blog.image_url);
      if (path) paths.push(path);
    }

    if (paths.length > 0) {
      await supabase.storage.from("blog-images").remove(paths);
    }

    await supabase.from("blogs").delete().eq("id", blog.id);

    fetchBlogs();
  }

  return (
    <div className="-mt-20">
    <div className="min-h-screen bg-[#EEF3EA] text-[#1B4332] pt-28 px-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold">Farm Blogs</h1>
          <p className="text-gray-600 mt-1">
            Insights & learnings 🌱
          </p>
        </div>

        {user && (
          <Link
            to="/create-blog"
            className="bg-[#4A7C59] text-white px-5 py-2 rounded-lg hover:bg-[#3b664a] transition"
          >
            + Create Blog
          </Link>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="h-52 bg-gray-300"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
                <div className="h-3 bg-gray-300 w-full rounded"></div>
                <div className="h-3 bg-gray-300 w-5/6 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && blogs.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">No blogs yet 🌱</p>
          <p className="text-sm mt-2">
            Start by creating your first blog!
          </p>
        </div>
      )}

      {/* BLOG GRID WITH STAGGER */}
      {!loading && blogs.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto"
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              className="group relative bg-white rounded-2xl overflow-hidden 
                         border border-green-100 shadow-sm 
                         hover:shadow-xl hover:scale-110 transition duration-300"
            >

              {/* IMAGE */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={
                    blog.images?.[0] ||
                    blog.image_url ||
                    "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
                  }
                  className="w-full h-full object-cover 
                             group-hover:scale-120 transition duration-500"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* TAG */}
                {blog.tags && (
                  <div className="absolute top-3 left-3 bg-white/90 text-[#1B4332] text-xs px-3 py-1 rounded-full shadow">
                    #{blog.tags.split(",")[0]}
                  </div>
                )}

                {/* TITLE */}
                <h2 className="absolute bottom-4 left-4 right-4 text-white text-lg font-semibold">
                  {blog.title}
                </h2>
              </div>

              {/* CONTENT */}
              <div className="p-5">

                <p className="text-gray-600 text-sm line-clamp-3">
                  {blog.content}
                </p>

                <div className="flex justify-between items-center mt-4">

                  <Link
                    to={`/blogs/${blog.id}`}
                    className="text-[#4A7C59] font-medium hover:underline"
                  >
                    Read →
                  </Link>

                  {user?.id === blog.user_id && (
                    <div className="flex gap-3 text-sm">
                      <Link
                        to={`/edit-blog/${blog.id}`}
                        className="text-yellow-600"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteBlog(blog)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </motion.div>
          ))}
        </motion.div>
      )}

    </div>
    </div>
  );
}