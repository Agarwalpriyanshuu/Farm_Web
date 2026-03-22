export default function NodeCard({ node, id }) {
  const percent = node?.percent || 0
  const isActive = node !== undefined

  return (
    <div
      className="bg-gray-800 p-6 rounded-xl text-center transition"
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <h3 className="mb-4 text-lg">Node {id}</h3>

      <div className="h-40 w-16 mx-auto border rounded-full overflow-hidden">
        <div
          className={`w-full ${
            isActive ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ height: `${percent}%` }}
        />
      </div>

      <p className="mt-4">
        {isActive ? `${percent}%` : "Offline"}
      </p>
    </div>
  )
}