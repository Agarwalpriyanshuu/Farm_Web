import { Link, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Navbar() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  // 🎯 Helper for active link
  //const isActive = (path) => location.pathname === path
  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <div className="fixed w-full top-0 z-50 bg-black/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">

        <Link
          to="/"
          className="text-green-400 font-bold text-xl hover:opacity-80 transition"
        >
          🌱 ANUSHONA FARM
        </Link>

        <div className="flex gap-6 items-center text-sm">

          <Link
            to="/"
            className={isActive("/home") ? activeClass : normalClass}
          >
            Home
          </Link>

          <Link
            to="/overview"
            className={isActive("/overview") ? activeClass : normalClass}
          >
            Overview
          </Link>

          <Link
            to="/photos"
            className={isActive("/photos") ? activeClass : normalClass}
          >
            Photos
          </Link>

          <Link
            to="/blogs"
            className={isActive("/blogs") ? activeClass : normalClass}
          >
            Blogs
          </Link>

          {session ? (
            <>
              <Link
                to="/dashboard"
                className={isActive("/dashboard") ? activeClass : normalClass}
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={isActive("/login") ? activeClass : loginActiveClass}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

const normalClass =
  "text-gray-300 hover:text-green-400 transition"

const activeClass =
  "text-green-400 font-semibold border-b-2 border-green-400 pb-1"

const loginActiveClass =
  "bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 text-white"