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

        <div style={{ padding: "20px" }}>
        <h2>📊 Farm Monitoring</h2>

        <div style={gridStyle}>
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