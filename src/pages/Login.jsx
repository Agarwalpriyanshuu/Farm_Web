import { useState } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and Password are required")
      return
    }

    setError("")
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) navigate("/dashboard")
    else {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="-mt-20">
    <div
      className="min-h-screen pt-28 flex items-center justify-center px-6 relative overflow-hidden 
                 bg-gradient-to-b from-[#EEF3EA] to-[#E4EDDA]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(74,124,89,0.08) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >

      {/* 🌿 STRONG ANIMATED BLOBS */}
      <motion.div
        className="absolute w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30 top-10 left-10"
        animate={{ y: [0, 60, 0], x: [0, 30, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.div
        className="absolute w-96 h-96 bg-green-300 rounded-full blur-3xl opacity-20 bottom-10 right-10"
        animate={{ y: [0, -60, 0], x: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* 🌱 LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white/90 backdrop-blur-md 
                   border border-green-100 shadow-xl rounded-2xl p-8 z-10"
      >

        <h2 className="text-3xl font-bold text-center text-[#1B4332] mb-2">
          Welcome Back 🌱
        </h2>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Login to manage your farm insights
        </p>

        {/* ❌ ERROR */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* 📧 EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-lg border border-green-100 
                     text-[#1B4332] placeholder-gray-400
                     focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 🔒 PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-5 rounded-lg border border-green-100 
                     text-[#1B4332] placeholder-gray-400
                     focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 🔘 BUTTON WITH ANIMATION */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium transition 
            ${
              loading
                ? "bg-gray-400"
                : "bg-[#4A7C59] hover:bg-[#3b664a]"
            }`}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

      </motion.div>
    </div>
    </div>
  )
}