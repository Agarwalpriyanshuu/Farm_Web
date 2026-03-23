import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

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

  // ✅ FIXED PATH EXTRACTION (ROBUST)
  function getFilePathFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split("/blog-images/");
      return parts[1]; // returns: blogs/filename.jpg
    } catch (err) {
      console.error("Invalid URL:", url);
      return null;
    }
  }

  // ✅ FULL DELETE (DB + STORAGE)
  async function deleteBlog(blog) {
    const confirmDelete = window.confirm("Delete this blog?");
    if (!confirmDelete) return;

    try {
      let paths = [];

      // MULTIPLE IMAGES
      if (blog.images?.length) {
        blog.images.forEach((url) => {
          const path = getFilePathFromUrl(url);
          if (path) paths.push(path);
        });
      }

      // OLD SINGLE IMAGE SUPPORT
      if (blog.image_url) {
        const path = getFilePathFromUrl(blog.image_url);
        if (path) paths.push(path);
      }

      console.log("Deleting images:", paths); // 🔍 DEBUG

      // DELETE FROM STORAGE
      if (paths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("blog-images")
          .remove(paths);

        if (storageError) {
          console.error("Storage delete error:", storageError);
        }
      }

      // DELETE FROM DB
      const { error: dbError } = await supabase
        .from("blogs")
        .delete()
        .eq("id", blog.id);

      if (dbError) {
        console.error("DB delete error:", dbError);
      }

      fetchBlogs();

    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-28 px-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold">Farm Blogs</h1>
          <p className="text-gray-400 mt-1">
            Insights & learnings 🌱
          </p>
        </div>

        {user && (
          <Link
            to="/create-blog"
            className="bg-green-500 px-5 py-2 rounded-lg hover:bg-green-600 transition"
          >
            + Create Blog
          </Link>
        )}
      </div>

      {/* 🔄 LOADING SKELETON */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white/5 rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-700"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-700 w-3/4 rounded"></div>
                <div className="h-3 bg-gray-700 w-full rounded"></div>
                <div className="h-3 bg-gray-700 w-5/6 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ❌ EMPTY STATE */}
      {!loading && blogs.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl">No blogs yet 🌱</p>
          <p className="text-sm mt-2">
            Start by creating your first blog!
          </p>
        </div>
      )}

      {/* BLOG GRID */}
      {!loading && blogs.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 
                         hover:scale-105 hover:shadow-lg transition duration-300"
            >

              {/* IMAGE */}
              <img
                src={
                  blog.images?.[0] ||
                  blog.image_url ||
                  "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
                }
                className="h-48 w-full object-cover"
              />

              <div className="p-5">

                <h2 className="text-xl font-bold">{blog.title}</h2>

                <p className="text-gray-400 mt-2 line-clamp-3">
                  {blog.content}
                </p>

                <div className="flex justify-between items-center mt-4">

                  <Link to={`/blogs/${blog.id}`} className="text-green-400">
                    Read →
                  </Link>

                  {user?.id === blog.user_id && (
                    <div className="flex gap-3 text-sm">
                      <Link to={`/edit-blog/${blog.id}`} className="text-yellow-400">
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteBlog(blog)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}