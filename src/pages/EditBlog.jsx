import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import ReactMarkdown from "react-markdown";

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

  // 📸 IMAGE HANDLING
  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  }

  function removePreview(index) {
    const newImages = [...images];
    const newPreview = [...preview];

    newImages.splice(index, 1);
    newPreview.splice(index, 1);

    setImages(newImages);
    setPreview(newPreview);
  }

  // ✍️ TOOLBAR
  function wrap(symbol) {
    const textarea = document.getElementById("editor");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selected = blog.content.substring(start, end);

    const newText =
      blog.content.substring(0, start) +
      symbol +
      selected +
      symbol +
      blog.content.substring(end);

    setBlog({ ...blog, content: newText });
  }

  function insert(text) {
    setBlog((prev) => ({
      ...prev,
      content: prev.content + text,
    }));
  }

  // 🚀 UPDATE BLOG
  async function handleUpdate(e) {
    e.preventDefault();

    if (!blog.title || !blog.content || !blog.tags) {
      setError("All fields are required");
      return;
    }

    setError("");
    setLoading(true);

    let newUrls = blog.images || [];

    // Upload new images
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

    setTimeout(() => {
      navigate(`/blogs/${id}`, { replace: true });
    }, 1000);
  }

  if (!blog) {
    return (
      <div className="pt-28 text-center text-gray-400">
        Loading blog...
      </div>
    );
  }

  return (
    <div className="-mt-20">
    <div className="min-h-screen bg-gradient-to-b from-[#EEF3EA] to-[#DCE8D5] text-[#1B4332] pt-28 px-6 flex justify-center">

      {showToast && <Toast message="Blog updated successfully ✅" />}

      <div className="max-w-6xl w-full bg-white/70 backdrop-blur p-8 rounded-2xl shadow border">

        {/* BACK */}
        <button
          onClick={() => navigate("/blogs")}
          className="text-green-600 mb-4 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-6">Edit Blog ✍️</h1>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">

          {/* TITLE */}
          <input
            className="w-full p-3 border rounded"
            value={blog.title}
            onChange={(e) =>
              setBlog({ ...blog, title: e.target.value })
            }
          />

          {/* TOOLBAR */}
          <div className="flex gap-2 flex-wrap">
            <button type="button" onClick={() => wrap("**")} className="btn">B</button>
            <button type="button" onClick={() => wrap("*")} className="btn">I</button>
            <button type="button" onClick={() => insert("\n# ")} className="btn">H1</button>
            <button type="button" onClick={() => insert("\n## ")} className="btn">H2</button>
            <button type="button" onClick={() => insert("\n- ")} className="btn">•</button>
          </div>

          {/* EDITOR + PREVIEW */}
          <div className="grid md:grid-cols-2 gap-6">

            <textarea
              id="editor"
              className="w-full h-96 p-4 border rounded bg-white"
              value={blog.content}
              onChange={(e) =>
                setBlog({ ...blog, content: e.target.value })
              }
            />

            <div className="bg-white p-4 rounded border overflow-y-auto">

              <ReactMarkdown
                components={{
                  h1: (props) => <h1 className="text-3xl font-bold mt-6" {...props} />,
                  h2: (props) => <h2 className="text-2xl font-semibold mt-5" {...props} />,
                  p: (props) => <p className="text-[#1B4332]" {...props} />,
                  strong: (props) => <strong className="font-bold" {...props} />,
                  em: (props) => <em className="italic" {...props} />,
                  li: (props) => <li className="ml-4 list-disc" {...props} />,
                }}
              >
                {blog.content}
              </ReactMarkdown>

            </div>
          </div>

          {/* TAGS */}
          <input
            className="w-full p-3 border rounded"
            value={blog.tags}
            onChange={(e) =>
              setBlog({ ...blog, tags: e.target.value })
            }
          />

          {/* EXISTING IMAGES */}
          {blog.images?.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {blog.images.map((img, i) => (
                <img key={i} src={img} className="h-20 rounded object-cover" />
              ))}
            </div>
          )}

          {/* NEW UPLOAD */}
          <input type="file" multiple onChange={handleImageChange} />

          {/* PREVIEW */}
          <div className="grid grid-cols-3 gap-2">
            {preview.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} className="h-20 rounded object-cover" />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <button
            disabled={loading}
            className={`w-full py-3 rounded ${
              loading
                ? "bg-gray-500"
                : "bg-[#4A7C59] hover:bg-[#3b664a] text-white"
            }`}
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>

        </form>
      </div>

      <style>
        {`
          .btn {
            background:#4A7C59;
            color:white;
            padding:6px 10px;
            border-radius:6px;
            font-size:12px;
          }
        `}
      </style>

    </div>
    </div>
  );
}