import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <div style={nav}>
      <h2 style={{ color: "#22c55e" }}>🌱 ANUSHONA FARM</h2>

      <div style={menu}>
        <Link to="/">Overview</Link>
        <Link to="/photos">Photos</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  )
}

const nav = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 30px",
  background: "#020617",
  borderBottom: "1px solid #1e293b"
}

const menu = {
  display: "flex",
  gap: "20px"
}