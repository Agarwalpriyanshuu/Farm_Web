import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import NodeCard from "../components/NodeCard"
import Navbar from "../components/Navbar"

export default function Dashboard() {
  const [nodes, setNodes] = useState([])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    const { data, error } = await supabase
      .from("moisture_data")
      .select("*")
      .order("timestamp", { ascending: false })

    if (!error && data) {
      const latest = {}

      data.forEach((row) => {
        if (!latest[row.node]) {
          latest[row.node] = row
        }
      })

      setNodes(Object.values(latest))
    }
  }

  return (
    <>
        <Navbar />

        <div className="pt-24 p-6">
        <h2 className="text-2xl mb-6">📊 Farm Status</h2>

        <div className="grid md:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => {
            const nodeId = i + 1
            const node = nodes.find(n => n.node === nodeId)

            return <NodeCard key={nodeId} node={node} id={nodeId} />
            })}
        </div>
        </div>
    </>
  )
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "20px"
}