import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Overview from "./pages/Overview"
import Photos from "./pages/Photos"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

import Blogs from "./pages/Blogs"
import BlogDetail from "./pages/BlogDetail"
import CreateBlog from "./pages/CreateBlog"
import EditBlog from "./pages/EditBlog"

import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20">
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/login" element={<Login />} />

        
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />

        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/create-blog"
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-blog/:id"
          element={
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          }
        />
      </Routes>
      </div>
    </Router>
  )
}