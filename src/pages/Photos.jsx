export default function Photos() {
  return (
    <div className="-mt-20">
    <div className="min-h-screen bg-[#F5F7F2] text-[#1B4332] pt-28 px-6">

      {/* 🌿 Header */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold">Farm Gallery</h1>
        <p className="text-gray-600 mt-3">
          A visual journey of growth, seasons, and sustainability 🌾
        </p>
      </div>

      {/* 📷 Empty State */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">

        <div className="bg-white border border-green-100 rounded-2xl p-10 shadow-sm text-center">

          <div className="text-5xl mb-4">📸</div>

          <h2 className="text-2xl font-semibold mb-2">
            No Photos Yet
          </h2>

          <p className="text-gray-600 mb-6">
            Start capturing your farm’s journey — from planting to harvest 🌱
          </p>

          <button className="bg-[#4A7C59] hover:bg-[#3b664a] text-white px-6 py-2 rounded-lg transition">
            Upload Photos (Coming Soon)
          </button>

        </div>

      </div>

      {/* 🌄 Future Grid Placeholder */}
      <div className="max-w-6xl mx-auto mt-20 grid md:grid-cols-3 gap-6 opacity-40">

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-40 bg-green-100 rounded-xl"
          ></div>
        ))}

      </div>

    </div>
    </div>
  );
}