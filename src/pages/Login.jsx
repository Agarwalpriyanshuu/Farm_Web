import { useState } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      navigate("/dashboard")
    }
  }

  return (
    <>
      <Navbar />

      <div style={center}>
        <div style={card}>
          <h2 style={{ marginBottom: "20px" }}>🔐 Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />

          <button onClick={handleLogin} style={button}>
            Login
          </button>
        </div>
      </div>
    </>
  )
}

const center = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #020617, #064e3b)"
}

const card = {
  background: "#1e293b",
  padding: "30px",
  borderRadius: "12px",
  width: "320px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  textAlign: "center"
}

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "none",
  outline: "none"
}

const button = {
  width: "100%",
  padding: "10px",
  background: "#22c55e",
  border: "none",
  borderRadius: "6px",
  color: "white",
  fontWeight: "bold"
}