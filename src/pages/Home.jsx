import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />

      <div style={hero}>
        <h1 style={title}>🌾 ANUSHONA FARM</h1>

        <p style={subtitle}>
          Smart Farming with Real-Time Soil Monitoring
        </p>

        <button style={btn} onClick={() => navigate("/login")}>
          Get Started
        </button>
      </div>
    </>
  )
}

const hero = {
  height: "90vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  background: "linear-gradient(135deg, #020617, #064e3b)"
}

const title = {
  fontSize: "50px",
  marginBottom: "20px"
}

const subtitle = {
  fontSize: "18px",
  color: "#94a3b8",
  marginBottom: "30px"
}

const btn = {
  padding: "12px 30px",
  background: "#22c55e",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontSize: "16px"
}