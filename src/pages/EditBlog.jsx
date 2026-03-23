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
  const [deletedImages, setDeletedImages] = useState([]);

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

  // ✅ Extract storage path
  function getFilePathFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split("/blog-images/");
      return parts[1];
    } catch {
      return null;
    }
  }

  // ✅ New images
  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  }

  // ✅ Remove new image (before upload)
  function removeNewImage(index) {
    const newImages = [...images];
    const newPreview = [...preview];

    newImages.splice(index, 1);
    newPreview.splice(index, 1);

    setImages(newImages);
    setPreview(newPreview);
  }

  // ✅ Remove existing image
  function removeExistingImage(index) {
    const updated = [...blog.images];
    const removed = updated.splice(index, 1)[0];

    setDeletedImages((prev) => [...prev, removed]);
    setBlog({ ...blog, images: updated });
  }

  async function handleUpdate(e) {
    e.preventDefault();

    if (!blog.title || !blog.content || !blog.tags) {
      setError("All fields are required");
      return;
    }

    setError("");
    setLoading(true);

    let updatedImages = blog.images || [];

    // 🔥 DELETE removed images from storage
    if (deletedImages.length > 0) {
      const paths = deletedImages
        .map(getFilePathFromUrl)
        .filter(Boolean);

      if (paths.length > 0) {
        await supabase.storage.from("blog-images").remove(paths);
      }
    }

    // 🔼 Upload new images
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

      updatedImages.push(data.publicUrl);
    }

    // 📝 Update DB
    const { error: updateError } = await supabase
      .from("blogs")
      .update({
        title: blog.title,
        content: blog.content,
        tags: blog.tags,
        images: updatedImages,
      })
      .eq("id", id);

    if (updateError) {
      setError("Update failed");
      setLoading(false);
      return;
    }

    setShowToast(true);

    setTimeout(() => {
      navigate(`/blogs/${id}`, { replace: true });
    }, 1000);
  }

  if (!blog) {
    return (
      <div className="pt-28 text-center text-gray-500">
        Loading blog...
      </div>
    );
  }

  return (
    <div className="-mt-20">
    <div className="mmin-h-screen bg-[#1B4332] text-[#F5F7F2] pt-28 px-6 flex justify-center">

      {showToast && <Toast message="Blog updated successfully ✅" />}

      <div className="max-w-2xl w-full bg-white/5 p-8 rounded-2xl border border-white/10">

        <button
          onClick={() => navigate("/blogs")}
          className="text-green-400 mb-4 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">

          <input
            className="w-full p-3 bg-black/40 border rounded"
            placeholder="Blog Title *"
            value={blog.title}
            onChange={(e) =>
              setBlog({ ...blog, title: e.target.value })
            }
          />

          <textarea
            className="w-full p-3 h-80 bg-black/40 border rounded"
            placeholder="Write your blog *"
            value={blog.content}
            onChange={(e) =>
              setBlog({ ...blog, content: e.target.value })
            }
          />

          <input
            className="w-full p-3 bg-black/40 border rounded"
            placeholder="Tags *"
            value={blog.tags}
            onChange={(e) =>
              setBlog({ ...blog, tags: e.target.value })
            }
          />

          {/* EXISTING IMAGES */}
          {blog.images?.length > 0 && (
            <div>
              <p className="text-sm mb-2">Existing Images</p>
              <div className="grid grid-cols-3 gap-2">
                {blog.images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} className="h-20 w-full object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPLOAD */}
          <input type="file" multiple onChange={handleImageChange} />

          {/* NEW PREVIEW */}
          <div className="grid grid-cols-3 gap-2">
            {preview.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} className="h-20 w-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            disabled={loading}
            className={`w-full py-3 rounded text-white ${
              loading
                ? "bg-gray-400"
                : "bg-[#4A7C59] hover:bg-[#3b664a]"
            }`}
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>

        </form>
      </div>
    </div>
    </div>
  );
}