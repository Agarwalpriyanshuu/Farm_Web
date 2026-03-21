import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div>
      <h1>🌱 ANUSHONA FARMS</h1>
      <p>Welcome to the Farm</p>

      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  )
}