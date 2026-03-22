import Navbar from "../components/Navbar"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />

      <div className="h-screen bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef')] bg-cover bg-center flex items-center justify-center">

        <div className="bg-black/60 backdrop-blur p-10 rounded-xl text-center">

          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4"
          >
            ANUSHONA FARM
          </motion.h1>

          <p className="text-gray-300 mb-6">
            Smart Farming powered by real-time soil monitoring
          </p>

          <button
            onClick={() => navigate("/overview")}
            className="bg-green-500 px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Explore Farm
          </button>
        </div>
      </div>

      <section className="py-20 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl mb-4">🌿 About Our Farm</h2>
        <p className="text-gray-400">
          We integrate sensors, automation and cloud intelligence to improve irrigation and crop efficiency.
        </p>
      </section>

      <section className="py-20 bg-black text-center">
        <h2 className="text-3xl mb-10">⚙️ How It Works</h2>

        <div className="grid md:grid-cols-4 gap-6 px-6">
          {["Sensors", "Cloud", "Dashboard", "Automation"].map((item) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 p-6 rounded-xl"
              key={item}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}