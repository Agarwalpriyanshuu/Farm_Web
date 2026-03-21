import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { supabase } from "../supabaseClient"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Loading...</div>

  if (!session) {
    return <Navigate to="/login" />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}