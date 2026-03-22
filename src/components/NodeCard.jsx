import { motion } from "framer-motion"

export default function NodeCard({ node, id }) {
  const percent = node?.percent || 0
  const isActive = node !== undefined

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-900 p-6 rounded-xl text-center shadow-lg"
    >
      <h3 className="mb-4 font-semibold">Node {id}</h3>

      <div className="h-40 w-16 mx-auto border border-gray-600 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${percent}%` }}
          transition={{ duration: 0.5 }}
          className={`absolute bottom-0 w-full ${
            isActive ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </div>

      <div className="mt-4">
        {isActive ? (
          <p className="text-green-400">{percent}%</p>
        ) : (
          <p className="text-red-400">Offline</p>
        )}
      </div>
    </motion.div>
  )
}