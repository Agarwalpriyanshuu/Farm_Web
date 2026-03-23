import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  function validate() {
    let newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!content.trim()) newErrors.content = "Content is required";
    if (!tags.trim()) newErrors.tags = "Tags are required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  }

  function removeImage(index) {
    const newImages = [...images];
    const newPreview = [...preview];

    newImages.splice(index, 1);
    newPreview.splice(index, 1);

    setImages(newImages);
    setPreview(newPreview);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    let imageUrls = [];

    for (let file of images) {
      const path = `blogs/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("blog-images")
        .upload(path, file);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(path);

      imageUrls.push(data.publicUrl);
    }

    const { error } = await supabase.from("blogs").insert([
      {
        title,
        content,
        tags,
        images: imageUrls,
        user_id: user.id,
      },
    ]);

    if (error) {
      alert("Error creating blog");
      setLoading(false);
      return;
    }

    setShowToast(true);

    setTimeout(() => {
      navigate("/blogs");
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-28 px-6 flex justify-center">

      {showToast && <Toast message="Blog created successfully 🎉" />}

      <div className="max-w-2xl w-full bg-white/5 p-8 rounded-2xl border border-white/10">

        <h1 className="text-3xl font-bold mb-6">Create Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TITLE */}
          <div>
            <input
              className={`w-full p-3 bg-black/40 border rounded ${
                errors.title ? "border-red-500" : "border-white/10"
              }`}
              placeholder="Blog Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* CONTENT */}
          <div>
            <textarea
              className={`w-full p-3 h-40 bg-black/40 border rounded ${
                errors.content ? "border-red-500" : "border-white/10"
              }`}
              placeholder="Write your blog *"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {errors.content && (
              <p className="text-red-400 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          {/* TAGS */}
          <div>
            <input
              className={`w-full p-3 bg-black/40 border rounded ${
                errors.tags ? "border-red-500" : "border-white/10"
              }`}
              placeholder="Tags *"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            {errors.tags && (
              <p className="text-red-400 text-sm mt-1">{errors.tags}</p>
            )}
          </div>

          <input type="file" multiple onChange={handleImageChange} />

          {/* Preview */}
          <div className="grid grid-cols-3 gap-3">
            {preview.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} className="h-24 w-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-xs px-2 rounded"
                >
                  ✕
                </button>
              </div>
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
            {loading ? "Publishing..." : "Publish Blog"}
          </button>

        </form>
      </div>
    </div>
  );
}