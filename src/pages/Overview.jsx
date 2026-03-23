export default function Overview() {
  return (
    <div className="-mt-20">
    <div className="min-h-screen bg-[#F5F7F2] text-[#1B4332] pt-24 px-6">

      {/* 🌿 Header */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold">Farm Overview</h1>
        <p className="text-gray-600 mt-3">
          Smart agriculture powered by IoT, automation, and real-time insights 🌱
        </p>
      </div>

      {/* 🌾 Cards Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {/* Card 1 */}
        <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-2">🌱 Soil Monitoring</h3>
          <p className="text-gray-600 text-sm">
            Sensors continuously track soil moisture levels to ensure optimal hydration.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-2">💧 Smart Irrigation</h3>
          <p className="text-gray-600 text-sm">
            Automated irrigation system waters crops based on real-time soil data.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition hover:-translate-y-1">
          <h3 className="text-xl font-semibold mb-2">📊 Data Insights</h3>
          <p className="text-gray-600 text-sm">
            Historical and live data help make better farming decisions.
          </p>
        </div>

      </div>

      {/* 🌄 Bottom Section */}
      <div className="max-w-5xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Built for Sustainable Farming 🌾
        </h2>
        <p className="text-gray-600">
          By combining IoT, automation, and analytics, this system ensures efficient
          resource usage while maximizing crop yield.
        </p>
      </div>

    </div>
    </div>
  );
}