import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  return (
    <div style={navStyle}>
      <h2>🌱 ANUSHONA FARM</h2>

      <button onClick={handleLogout} style={btnStyle}>
        Logout
      </button>
    </div>
  )
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 25px",
  background: "#1e293b",
  borderBottom: "1px solid #334155"
}

const btnStyle = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px"
}