import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchPhotos();
    getUser();
  }, []);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  async function fetchPhotos() {
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });

    setPhotos(data || []);
  }

  function handleFiles(e) {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreview(selectedFiles.map((f) => URL.createObjectURL(f)));
  }

  function removePreview(index) {
    const newFiles = [...files];
    const newPreview = [...preview];

    newFiles.splice(index, 1);
    newPreview.splice(index, 1);

    setFiles(newFiles);
    setPreview(newPreview);
  }

  async function uploadPhotos() {
    if (!files.length) return alert("Select images");

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    for (let file of files) {
      const path = `photos/${Date.now()}-${file.name}`;

      await supabase.storage.from("farm-photos").upload(path, file);

      const { data } = supabase.storage
        .from("farm-photos")
        .getPublicUrl(path);

      await supabase.from("photos").insert({
        image_url: data.publicUrl,
        tags: tag,
        user_id: user.id,
      });
    }

    setFiles([]);
    setPreview([]);
    setTag("");
    setLoading(false);

    fetchPhotos();
  }

  function getPath(url) {
    try {
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split("/object/public/farm-photos/");
      return parts[1]; // THIS is the correct path
    } catch {
      return null;
    }
  }

  async function deletePhoto(photo) {
    if (!confirm("Delete photo?")) return;

    const path = getPath(photo.image_url);

    console.log("Deleting path:", path); // 👈 DEBUG

    if (path) {
      const { error: storageError } = await supabase.storage
        .from("farm-photos")
        .remove([path]);

      console.log("Storage delete:", storageError);
    }

    const { error: dbError } = await supabase
      .from("photos")
      .delete()
      .eq("id", photo.id);

    console.log("DB delete:", dbError);

    fetchPhotos();
  }

  return (
    <div className="min-h-screen pt-28 px-6 bg-gradient-to-b from-[#EEF3EA] to-[#DCE8D5] text-[#1B4332]">

      {/* HEADER */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-10">
        <div>
          <h1 className="text-4xl font-bold">Farm Gallery 🌿</h1>
          <p className="text-gray-600 text-sm">
            Visual journey of your farm
          </p>
        </div>

        {/* EDIT BUTTON */}
        {user && (
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-lg text-sm ${
              editMode
                ? "bg-red-500 text-white"
                : "bg-[#4A7C59] text-white"
            }`}
          >
            {editMode ? "Exit Edit" : "Edit"}
          </button>
        )}
      </div>

      {/* ✨ FLOATING UPLOAD PANEL */}
      {editMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mb-10 bg-white/80 backdrop-blur p-4 rounded-xl shadow border"
        >
          <input type="file" multiple onChange={handleFiles} />

          <input
            placeholder="Tag (optional)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full p-2 border rounded mt-2"
          />

          {/* PREVIEW */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {preview.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} className="h-16 w-16 rounded object-cover" />
                <button
                  onClick={() => removePreview(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={uploadPhotos}
            className="w-full mt-3 bg-[#4A7C59] text-white py-2 rounded"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </motion.div>
      )}

      {/* 📸 COLLAGE */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 max-w-6xl mx-auto space-y-4">

        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative group"
          >

            <img
              src={photo.image_url}
              onClick={() => setSelected(photo.image_url)}
              className="w-full rounded-xl cursor-pointer hover:scale-[1.04] transition"
            />

            {/* TAG (VIEW MODE ALSO OK) */}
            {photo.tags && (
              <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                #{photo.tags}
              </span>
            )}

            {/* DELETE ONLY IN EDIT MODE */}
            {editMode && user?.id === photo.user_id && (
              <button
                onClick={() => deletePhoto(photo)}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 rounded"
              >
                ✕
              </button>
            )}

          </motion.div>
        ))}

      </div>

      {/* LIGHTBOX */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <img src={selected} className="max-h-[90vh] max-w-[90vw] rounded" />
        </div>
      )}
    </div>
  );
}