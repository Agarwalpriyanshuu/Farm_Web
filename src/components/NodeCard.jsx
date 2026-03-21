import PropTypes from 'prop-types'

export default function NodeCard({ node, id }) {
  const percent = node ? node.percent : 0
//  const isActive = node && (Date.now() - new Date(node.timestamp)) < 60000
  const isActive = node !== undefined 
  return (
    <div style={cardStyle}>
      <h3>Node {id}</h3>

      <div style={cylinderOuter}>
        <div
          style={{
            ...cylinderInner,
            height: `${percent}%`,
            backgroundColor: isActive ? "#4CAF50" : "#FF4C4C"
          }}
        />
      </div>

      <p style={{ marginTop: "10px" }}>
        {isActive ? (
          <span style={{ color: "#22c55e" }}>🟢 {percent}%</span>
        ) : (
          <span style={{ color: "#ef4444" }}>🔴 Offline</span>
        )}
      </p>
      
    </div>
  )
}

const cardStyle = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
}

const cylinderOuter = {
  height: "140px",
  width: "60px",
  border: "2px solid #94a3b8",
  borderRadius: "30px",
  margin: "15px auto",
  display: "flex",
  alignItems: "flex-end",
  overflow: "hidden",
  background: "#0f172a"
}

const cylinderInner = {
  width: "100%",
  transition: "height 0.5s ease"
}

NodeCard.propTypes = {
  node: PropTypes.shape({
    percent: PropTypes.number.isRequired
  }),
  id: PropTypes.number.isRequired
}