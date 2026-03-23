import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

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

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  }

  async function handleUpdate(e) {
    e.preventDefault();

    // ✅ VALIDATION
    if (!blog.title || !blog.content || !blog.tags) {
      setError("All fields are required");
      return;
    }

    setError("");
    setLoading(true);

    let newUrls = blog.images || [];

    // Upload images
    for (let file of images) {
      const path = `blogs/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(path, file);

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(path);

      newUrls.push(data.publicUrl);
    }

    const { error: updateError } = await supabase
      .from("blogs")
      .update({
        ...blog,
        images: newUrls,
      })
      .eq("id", id);

    if (updateError) {
      setError("Update failed");
      setLoading(false);
      return;
    }

    setShowToast(true);

    // Delay for toast UX
    setTimeout(() => {
      navigate(`/blogs/${id}`, { replace: true });
    }, 1000);
  }

  if (!blog) {
    return (
      <div className="pt-28 text-center text-white">
        Loading blog...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-28 px-6 flex justify-center">

      {showToast && <Toast message="Blog updated successfully ✅" />}

      <div className="max-w-2xl w-full bg-white/5 p-8 rounded-2xl border border-white/10">

        <button
          onClick={() => navigate("/blogs")}
          className="text-green-400 mb-4 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">

          <input
            className="w-full p-3 bg-black/40 border rounded"
            value={blog.title}
            onChange={(e) =>
              setBlog({ ...blog, title: e.target.value })
            }
          />

          <textarea
            className="w-full p-3 h-40 bg-black/40 border rounded"
            value={blog.content}
            onChange={(e) =>
              setBlog({ ...blog, content: e.target.value })
            }
          />

          <input
            className="w-full p-3 bg-black/40 border rounded"
            value={blog.tags}
            onChange={(e) =>
              setBlog({ ...blog, tags: e.target.value })
            }
          />

          {/* Existing Images */}
          {blog.images?.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {blog.images.map((img, i) => (
                <img key={i} src={img} className="h-20 rounded" />
              ))}
            </div>
          )}

          {/* Upload */}
          <input type="file" multiple onChange={handleImageChange} />

          {/* Preview */}
          <div className="grid grid-cols-3 gap-2">
            {preview.map((src, i) => (
              <img key={i} src={src} className="h-20 rounded" />
            ))}
          </div>

          <button
            disabled={loading}
            className={`w-full py-3 rounded ${
              loading
                ? "bg-gray-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>

        </form>
      </div>
    </div>
  );
}