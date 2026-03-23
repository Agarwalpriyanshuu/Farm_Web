import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import Navbar from "../components/Navbar"
import { motion } from "framer-motion"
import NodeCard from "../components/NodeCard"

export default function Dashboard() {
  const [nodes, setNodes] = useState([])

  useEffect(() => {
    fetchData()

    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    const { data } = await supabase
      .from("moisture_data")
      .select("*")
      .order("timestamp", { ascending: false })

    if (data) {
      const latest = {}

      data.forEach((row) => {
        if (!latest[row.node]) {
          latest[row.node] = row
        }
      })

      setNodes(Object.values(latest))
    }
  }

  const getNode = (id) => nodes.find((n) => n.node === id)

  // 🔥 Stats
  const activeNodes = nodes.length
  const avg =
    nodes.reduce((sum, n) => sum + n.percent, 0) / (nodes.length || 1)

  return (
    <>

      <div className="pt-24 px-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📊 Farm Dashboard</h1>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Active Nodes" value={activeNodes} />
          <StatCard title="Offline Nodes" value={10 - activeNodes} />
          <StatCard title="Avg Moisture" value={`${avg.toFixed(1)}%`} />
        </div>

        {/* NODE GRID */}
        <div className="grid md:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => {
            const id = i + 1
            const node = getNode(id)

            return <NodeCard key={id} node={node} id={id} />
          })}
        </div>
      </div>
    </>
  )
}
function StatCard({ title, value }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl text-center shadow-lg">
      <h3 className="text-gray-400 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-green-400">{value}</p>
    </div>
  )
}