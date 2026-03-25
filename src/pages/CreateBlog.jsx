import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Toast from "../components/Toast";

export default function CreateBlog() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // 📸 IMAGE HANDLING
  function handleImages(e) {
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

    const selected = content.substring(start, end);

    const newText =
      content.substring(0, start) +
      symbol +
      selected +
      symbol +
      content.substring(end);

    setContent(newText);
  }

  function insert(text) {
    setContent((prev) => prev + text);
  }

  // 🚀 SUBMIT
  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !content || !tags) {
      setError("All fields are mandatory");
      return;
    }

    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    let imageUrls = [];

    for (let file of images) {
      const path = `blogs/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("blog-images")
        .upload(path, file);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(path);

      imageUrls.push(data.publicUrl);
    }

    await supabase.from("blogs").insert({
      title,
      content,
      tags,
      images: imageUrls,
      user_id: user.id,
    });

    setShowToast(true);

    setTimeout(() => navigate("/blogs"), 1000);
  }

  return (
    <div className="-mt-20">
    <div className="mmin-h-screen bg-gradient-to-b from-[#EEF3EA] to-[#DCE8D5] text-[#1B4332] pt-28 px-6 flex justify-center">
      <div className="max-w-6xl w-full bg-white/70 backdrop-blur p-8 rounded-2xl shadow border">
        {/* BACK */}
        <button
          onClick={() => navigate("/blogs")}
          className="text-green-600 mb-5 hover:underline"
        >
          ← Back
        </button>

        {showToast && <Toast message="Blog published successfully 🌱" />}

        <div className="max-w-6xl mx-auto">

          <h1 className="text-3xl font-bold mb-6">Create Blog ✍️</h1>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* TITLE */}
          <input
            className="w-full p-3 border rounded mb-4"
            placeholder="Blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* TOOLBAR */}
          <div className="flex gap-2 flex-wrap mb-2">
            <button onClick={() => wrap("**")} className="btn">B</button>
            <button onClick={() => wrap("*")} className="btn">I</button>
            <button onClick={() => insert("\n# ")} className="btn">H1</button>
            <button onClick={() => insert("\n## ")} className="btn">H2</button>
            <button onClick={() => insert("\n- ")} className="btn">•</button>
          </div>

          {/* EDITOR + PREVIEW */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">

            <textarea
              id="editor"
              className="w-full h-96 p-4 border rounded bg-white"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog..."
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
                {content || "Live preview..."}
              </ReactMarkdown>

            </div>
          </div>

          {/* TAGS */}
          <input
            className="w-full p-3 border rounded mb-4"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {/* IMAGES */}
          <input type="file" multiple onChange={handleImages} />

          <div className="flex gap-2 mt-3 flex-wrap">
            {preview.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} className="h-20 w-20 object-cover rounded" />
                <button
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
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 bg-[#4A7C59] text-white py-3 rounded hover:bg-[#3b664a]"
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>

        </div>
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