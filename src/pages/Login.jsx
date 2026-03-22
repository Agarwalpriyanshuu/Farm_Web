import { useState } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (!error) navigate("/dashboard")
    else alert(error.message)
  }

  return (
    <>
      <Navbar />

      <div className="h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1492496913980-501348b61469')] bg-cover">

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/60 backdrop-blur p-8 rounded-xl w-80"
        >
          <h2 className="text-center mb-4">Login</h2>

          <input
            placeholder="Email"
            className="w-full p-2 mb-3 rounded bg-gray-800"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 rounded bg-gray-800"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-green-500 py-2 rounded"
          >
            Login
          </button>
        </motion.div>
      </div>
    </>
  )
}